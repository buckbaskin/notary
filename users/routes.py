from app import server
from flask import render_template
from flask import request

import analytics

from users.authenticate import check_auth, AuthError
from db import User

##### Users #####

@analytics.trace
@server.route('/login', methods=['GET'])
def get_login_html():
    vm = {}
    vm['title'] = 'Login to Notary'
    return render_template('login.html', vm=vm)

@analytics.trace
@server.route('/profile', methods=['GET'])
def get_profile_html():
    vm = {}
    vm['title'] = 'Your Profile'
    return render_template('user.html', vm=vm)

@analytics.trace
@server.route('/u.json', methods=['POST'])
def operate_users():
    content = request.get_json()
    if content['action'] == 'create':
        return User.create_one(content['username'], content['password'])
    try:
        # raises a Validation error if the request isn't authorized
        check_auth(content)
    except AuthError:
        print('AuthError')
        return ''
    return select_operation(content)

###

def select_operation(content):
    if content['action'] == 'create':
        return User.create_one(content['username'], content['password'])
    # TODO(buckbaskin): implement the rest of the API here
    else:
        return ''

###
