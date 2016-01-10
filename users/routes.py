from app import server
from flask import render_template
from flask import request

import json

import analytics

from users.authenticate import check_auth, AuthError
from db import User, LoginToken

##### Users #####

@server.route('/login', methods=['GET'])
def login_page():
    @analytics.trace
    def get_login_html():
        vm = {}
        vm['title'] = 'Login to Notary'
        return render_template('login.html', vm=vm)
    return get_login_html()

@server.route('/profile', methods=['GET'])
def profile_page():
    @analytics.trace
    def get_profile_html():
        vm = {}
        vm['title'] = 'Your Profile'
        return render_template('user.html', vm=vm)
    return get_profile_html()

@server.route('/u.json', methods=['POST'])
def users_api():
    @analytics.trace
    def operate_users():
        content = request.get_json()
        if content['action'] == 'create':
            print('create user action')
            return User.create_one(content['username'], content['password'])
        elif content['action'] == 'login':
            print('login action')
            if User.check_password(content['username'], content['password']):
                token = LoginToken.create_one(content['username'])
                return json.dumps(token)
            else:
                json.dumps({'error': 'invalid login'})
        try:
            # raises a Validation error if the request isn't authorized
            check_auth(content)
        except AuthError:
            print('AuthError, invalid credentials')
            return json.dumps({'error': 'invalid credentials'})
        return select_operation(content)
    return operate_users()

###

def select_operation(content):
    print('select operation action')
    if content['action'] == 'create':
        return User.create_one(content['username'], content['password'])
    # TODO(buckbaskin): implement the rest of the API here
    elif content['action'] == 'login':
        print('login action')
        if User.check_password(content['username'], content['password']):
            token = LoginToken.create_one(content['username'])
            return json.dumps(token)
        else:
            json.dumps({'error': 'invalid login'})
    return json.dumps({'error': 'invalid operation'})

###
