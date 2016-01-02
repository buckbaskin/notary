# pylint: disable=superfluous-parens

from app import server
from flask import render_template
from flask import request

import json
import dateutil.parser as dateparser

import analytics
from db import Note

from users import check_auth, AuthError
from users import routes

from notes import routes

##### Index #####

@analytics.trace
@server.route('/', methods=['GET'])
def index():
    vm = {}
    vm['title'] = ''
    return render_template('index.html', vm=vm)

##### Error Handling #####

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
    vm['error'] = error
    return render_template('500.html', vm=vm), 500
