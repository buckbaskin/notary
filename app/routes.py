from app import server
from flask import render_template
from app import db

import json

import analytics

@analytics.trace
@server.route('/', methods=['GET'])
def index():
    vm = {}
    vm['title'] = 'Notary'
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
    # do something with json
    json = ''
    return json

@analytics.trace
@server.route('/n/<int:note_id>.json', methods=['GET'])
def note_json(note_id):
    # do something with json
    json = ''
    return json

@analytics.trace
@server.route('/n/<int:note_id>.json', methods=['POST'])
def update_note(note_id):
    # do something with incoming json to server
    # this is where I'd do the note delta/version control
    # this may also include delete inforamtion
    return note_json(note_id)

@analytics.trace
@server.errorhandler(404)
def not_found_error(error):
    return render_template('404.html', title="something wasn't found"), 404

@analytics.trace
@server.errorhandler(500)
def internal_server_error(error):
    db.session.rollback()
    return render_template('500.html', title="oops, the computer didn't computer"), 500