from app import server
from flask import render_template
from flask import request

import json

import analytics
from db import Note

@analytics.trace
@server.route('/', methods=['GET'])
def index():
    vm = {}
    vm['title'] = ''
    return render_template('index.html', vm=vm)

@analytics.trace
@server.route('/notes', methods=['GET'])
def notes_html():
    vm = {}
    vm['title'] = 'Your Notes'
    cursor = Note.get_all()
    vm['notes'] = []
    for note in cursor:
        note['_id'] = str(note['_id'])
        vm['notes'].append(dict(note))
    return render_template('notes.html', vm=vm)

@analytics.trace
@server.route('/n.json', methods=['GET'])
def get_all_notes():
    cursor = Note.get_all()
    notes = []
    for note in cursor:
        note['_id'] = str(note['_id'])
        notes.append(note)
    return json.dumps(notes)

@analytics.trace
@server.route('/n.json', methods=['POST'])
def operate_notes():
    content = request.get_json()
    if 'action' not in content:
        return ''
    else:
        if content['action'] == 'create':
            return create_note()
        elif len(content['action']) >= 4 and content['action'][:4] == 'read':
            return select_read(content)
        elif content['action'] == 'update':
            return update_notes(content)
        elif content['action'] == 'delete':
            return delete_notes(content)
        else:
            return ''

#####

@analytics.trace
def create_note():
    new_id = Note.create_one()
    return get_note(new_id)

@analytics.trace
def select_read(content):
    if content['action'] == 'readone':
        return get_note(content['_id'])
    elif content['action'] == 'read':
        if '_id' in content:
            return get_note(content['_id'])
        else:
            return get_notes(content)
    elif content['action'] == 'readmany':
        return get_notes(content)

@analytics.trace
def get_note(note_id):
    # do something with json
    note = Note.get_one(note_id)
    note['_id'] = str(note['_id'])
    json_ = json.dumps(note)
    return json_

@analytics.trace
def get_notes(content):
    #TODO(buckbaskin): this needs more implementation
    if 'sort_by' in content:
        notes = list(Note.get_all(sort=content['sort_by']))
    else:
        notes = list(Note.get_all())
    return json.dumps(notes)

@analytics.trace
def update_notes(content):
    # TODO(buckbaskin): this is where I'd do the note delta/version control
    for note in content['notes']:
        Note.update_one(note['_id'], note['title'], note['meta'], 
            note['content'])
    return json.dumps({'response': 'success'})

@analytics.trace
def delete_notes(content):
    for id_ in content['ids']:
        # TODO(buckbaskin): implement note delete
        pass
    return json.dumps({'response': 'success'})

#####

@analytics.trace
@server.errorhandler(404)
def not_found_error(error):
    vm = {}
    vm['title'] = "something wasn't found"
    vm['error'] = error
    return render_template('404.html', vm=vm), 404

@analytics.trace
@server.errorhandler(500)
def internal_server_error(error):
    # db.session.rollback()
    vm = {}
    vm['title'] = "oops, the computer didn't computer"
    vm['error'] = 'error'
    return render_template('500.html', vm=vm), 500
