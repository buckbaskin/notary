# pylint: disable=superfluous-parens

from app import server
from flask import render_template

import analytics

from users import routes
from notes import routes

##### Index #####

@server.route('/', methods=['GET'])
def index():
    @analytics.trace
    def index_html():
        vm = {}
        vm['title'] = ''
        print('render_template(index.html, vm=vm)')
        return render_template('index.html', vm=vm)
    return index_html()

##### Error Handling #####

@server.errorhandler(404)
def not_found_error(error):
    @analytics.trace
    def not_found_error_html(error):
        vm = {}
        vm['title'] = "something wasn't found"
        vm['error'] = error
        return render_template('404.html', vm=vm), 404
    return not_found_error_html(error)

@server.errorhandler(500)
def internal_server_error(error):
    @analytics.trace
    def internal_server_error_html(error):
        # db.session.rollback()
        vm = {}
        vm['title'] = "oops, the computer didn't computer"
        vm['error'] = error
        return render_template('500.html', vm=vm), 500
    return internal_server_error_html(error)
