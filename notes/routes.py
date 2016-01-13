# pylint: disable=superfluous-parens
from app import server
from flask import render_template, redirect, url_for
from flask import request, make_response

import json
import dateutil.parser as dateparser

import analytics

from db import Note, User, LoginToken

from users.authenticate import check_auth, AuthError

##### Notes #####

@server.route('/notes', methods=['GET'])
def notes_page():
    @analytics.trace
    def notes_html():
        vm = {}
        vm['title'] = 'Your Notes'
        cursor = []
        vm['notes'] = []

        for note in cursor:
            vm['notes'].append(clean_note_for_json(note))
        return render_template('notes.html', vm=vm)
    return notes_html()

@server.route('/n.json', methods=['POST'])
def notes_api():
    @analytics.trace
    def operate_notes():
        content = request.get_json()
        try:
            # raises a AuthError if the request isn't authorized
            if 'username' in request.cookies and 'atoken' in request.cookies:
                print('auth with cookie', request.cookies['username'], request.cookies['atoken'])
                check_auth(request.cookies['username'], request.cookies['atoken'])
                username = request.cookies['username']
            else:
                print('contento', content)
                check_auth(content['username'], content['atoken'])
                username = content['username']

            if 'uuid' in request.cookies:
                uuid = request.cookies['uuid']
            else:
                uuid = User.generate_uuid()
        except AuthError:
            print('Auth Error, redirect to login')
            return json.dumps({'redirect': 'http://localhost:5000/login'})

        if 'action' not in content:
            print('action not in content')
            return ''
        else:
            if content['action'] == 'create':
                print('create action')
                res_text = create_notes(content)
            elif len(content['action']) >= 4 and content['action'][:4] == 'read':
                print('select_read action')
                res_text = select_read(content)
            elif content['action'] == 'update':
                print('update action')
                res_text = update_notes(content)
            elif content['action'] == 'delete':
                print('delete action')
                res_text = delete_notes(content)
            else:
                print('request did not match API')
                return ''
            response = make_response(res_text)
            print('setting uuid, username, token')
            response.set_cookie('uuid', uuid)
            response.set_cookie('username', username)
            response.set_cookie('atoken', LoginToken.create_one(username))
            response.set_cookie('path', '/')
            return response
    return operate_notes()

###
@analytics.trace
def create_notes(content):
    note_objects = content['notes']
    username = content['atoken'][0]
    # new_ids = [Note.create_from_object(obj, username) for obj in note_objects]
    new_ids = []
    for obj in note_objects:
        new_ids.append(Note.create_from_object(obj, username))
    return json.dumps(list(map(get_note, new_ids)))

# @analytics.trace
# def create_note():
#     new_id = Note.create_one()
#     return get_note(new_id)

@analytics.trace
def select_read(content):
    if content['action'] == 'readone':
        print('get_note action 1')
        return get_note(content['_id'])
    elif content['action'] == 'read':
        if '_id' in content:
            print('get note action 2')
            return get_note(content['_id'])
        else:
            print('get_notes action 1')
            return get_notes(content)
    elif content['action'] == 'readmany':
        print('get_notes action 2')
        return get_notes(content)
    else:
        return ''

@analytics.trace
def get_note(note_id):
    # do something with json
    note = Note.get_one(note_id)
    print('get_note: cursor length: '+str(1))
    json_ = json.dumps(clean_note_for_json(note))
    return json_

@analytics.trace
def get_notes(content):
    #TODO(buckbaskin): this needs more implementation
    if 'sort_by' in content:
        print('get notes sort by')
        cursor = Note.get_all(username=content['atoken'][0], sort=content['sort_by'])
    else:
        cursor = Note.get_all(username=content['atoken'][0])

    notes = []
    for note in cursor:
        try:
            notes.append(clean_note_for_json(note))
        except AttributeError:
            pass

    print('notesl '+str(len(notes)))
    return json.dumps(notes)

@analytics.trace
def update_notes(content):
    # TODO(buckbaskin): this is where I'd do the note delta/version control
    # print('updating %d notes' % len(content['notes']))
    for note in content['notes']:
        note = clean_note_from_json(note)
        Note.update_one(note['_id'], note['title'], note['meta'],
            note['content'], content['atoken'][0])
    return json.dumps({'response': 'success'})

@analytics.trace
def delete_notes(content):
    for id_ in content['ids']:
        # TODO(buckbaskin): implement note delete
        pass
    return json.dumps({'response': 'success'})

def clean_note_from_json(note):
    if 'updated' in note['meta']:
        if isinstance(note['meta']['updated'], str):
            note['meta']['updated'] = dateparser.parse(note['meta']['updated'])
    if 'created' in note['meta']:
        if isinstance(note['meta']['created'], str):
            note['meta']['created'] = dateparser.parse(note['meta']['created'])
    if 'due_date' in note['meta']:
        if isinstance(note['meta']['due_date'], str):
            note['meta']['due_date'] = dateparser.parse(note['meta']['due_date']) # pylint: disable=line-too-long
    return note

def clean_note_for_json(note):
    note['_id'] = str(note['_id'])
    if isinstance(note['meta'], (dict,)):
        if 'updated' in note['meta']:
            if not isinstance(note['meta']['updated'], str):
                print('note meta updated: ', note['meta']['updated'])
                note['meta']['updated'] = note['meta']['updated'].isoformat()
        if 'created' in note['meta']:
            if not isinstance(note['meta']['created'], str):
                note['meta']['created'] = note['meta']['created'].isoformat()
        if 'due_date' in note['meta']:
            if note['meta']['due_date'] is None:
                del note['meta']['due_date']
            elif not isinstance(note['meta']['due_date'], str):
                note['meta']['due_date'] = note['meta']['due_date'].isoformat()
    return note

###
