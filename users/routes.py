from app import server
from flask import render_template, redirect, url_for
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
        vm['redirect'] = request.args.get('redirect')
        return render_template('login.html', vm=vm)
    return get_login_html()

@server.route('/profile', methods=['GET'])
def profile_page():
    @analytics.trace
    def get_profile_html():
        vm = {}
        vm['title'] = 'Your Profile'
        if 'atoken' in request.cookies and 'username' in request.cookies:
            authToken = request.cookies['atoken']
            username = request.cookies['username']
            if not LoginToken.check_token(username, authToken):
                return redirect(url_for('login_page'))

            user = User.get_by_username(username)
            if user is not None:
                vm['user'] = {}
                vm['user']['username'] = user['username']
                vm['user']['uuid'] = user['_id']
                vm['user']['created'] = user['meta']['created'].strftime('%b %d, %Y at %H:%M:%S')
                vm['user']['logged_in'] = user['meta']['logged_in'].strftime('%b %d, %Y at %H:%M:%S')
                print(user)
            else:
                vm['message'] = 'No profile for this user'
        return render_template('profile.html', vm=vm)
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
