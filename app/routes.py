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
    return render_template('notes.html', vm=vm)

@analytics.trace
@server.route('/notes', methods=['POST'])
def create_note():
    new_id = Note.create_one()
    return note_json(new_id)

@analytics.trace
@server.route('/n/<note_id>.json', methods=['GET'])
def note_json(note_id):
    # do something with json
    print 'type?: '+str(type(note_id))
    print 'id?  : '+str(note_id)
    note = Note.get_one(note_id)
    print 'type?: '+str(type(note))
    print 'note?: '+str(note)
    print 'note[]? '+str(note['_id'])
    note['_id'] = str(note['_id'])
    json_ = json.dumps(note)
    print 'json_: '+str(json_)
    return json_

@analytics.trace
@server.route('/n/<note_id>.json', methods=['POST'])
def update_note(note_id):
    # do something with incoming json to server
    # this is where I'd do the note delta/version control
    # this may also include delete inforamtion
    print 'note_id', note_id
    content = request.get_json()
    print 'content title: ', content['title']
    print 'content meta: ', content['meta']
    print 'content cont: ', content['content']
    return note_json(note_id)

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