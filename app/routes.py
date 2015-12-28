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
def notes():
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
    vm = {}
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
        elif content['action'] == 'readone':
            return get_note(content['_id'])
        elif content['action'] == 'read':
            if '_id' in content:
                return get_note(content['_id'])
            else:
                return get_notes(content)
        elif content['action'] == 'readmany':
            return get_notes(content)
        elif content['action'] == 'update':
            return update_note(content)
        elif content['action'] == 'delete':
            return delete_notes(content)
        else:
            return ''

#####

@analytics.trace
def create_note():
    new_id = Note.create_one()
    return note_json(new_id)

@analytics.trace
def get_note(note_id):
    # do something with json
    print('type?: '+str(type(note_id)))
    print('id?  : '+str(note_id))
    note = Note.get_one(note_id)
    print('type?: '+str(type(note)))
    print('note?: '+str(note))
    print('note[]? '+str(note['_id']))
    note['_id'] = str(note['_id'])
    json_ = json.dumps(note)
    print('json_: '+str(json_))
    return json_

@analytics.trace
def get_notes(content):
    #TODO(buckbaskin): this needs more implementation
    notes = list(Note.get_all())
    return json.dumps(notes)

@analytics.trace
def update_note(content):
    # TODO(buckbaskin): this is where I'd do the note delta/version control
    for note in content['notes']:
        result = Note.update_one(note['_id'], note['title'], note['meta'], note['content'])
    return {'response': 'success'}

@analytics.trace
def delete_notes(content):
    for id_ in content['ids']:
        # TODO(buckbaskin): implement note delete
        pass
    return {'response': 'success'}

#####

@analytics.trace
@server.errorhandler(404)
def not_found_error(error):
    vm = {}
    vm['title'] = "something wasn't found"
    return render_template('404.html', vm=vm), 404

@analytics.trace
@server.errorhandler(500)
def internal_server_error(error):
    # db.session.rollback()
    vm = {}
    vm['title'] = "oops, the computer didn't computer"
    return render_template('500.html', vm=vm), 500