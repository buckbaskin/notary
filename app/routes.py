# pylint: disable=superfluous-parens

from app import server
from flask import render_template

import analytics

from users import routes
from notes import routes

##### Index #####

# @analytics.trace
# @server.route('/', methods=['GET'])
# def index():
#     vm = {}
#     vm['title'] = ''
#     print('render_template(index.html, vm=vm)')
#     return render_template('index.html', vm=vm)

@analytics.trace
@server.route('/', methods=['GET'])
def index():
    vm = {}
    vm['title'] = ''
    print('render_template(index.html, vm=vm)')
    colloquim = render_template('index.html', vm=vm)
    print(colloquim)
    return str(colloquim), 200

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
