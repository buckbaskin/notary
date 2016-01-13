from app import server
from flask import render_template, redirect, url_for
from flask import request, make_response

import json

import analytics

from users.authenticate import check_auth, AuthError
from db import User, LoginToken

# pylint: disable=superfluous-parens

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
                vm['user']['created'] = (user['meta']['created']
                    .strftime('%b %d, %Y at %H:%M:%S'))
                vm['user']['logged_in'] = (user['meta']['logged_in']
                    .strftime('%b %d, %Y at %H:%M:%S'))
                print(user)
            else:
                vm['message'] = 'No profile for this user'
        return render_template('profile.html', vm=vm)
    return get_profile_html()

@server.route('/u.json', methods=['POST'])
def users_api():
    if 'uuid' not in request.cookies:
        uuid = User.generate_uuid()
    else:
        uuid = request.cookies['uuid']

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
                response = make_response(json.dumps(token))

                response.set_cookie('username', content['username'])
                response.set_cookie('atoken', token)
                response.set_cookie('uuid', uuid)
                response.set_cookie('path', '/')
                return json.dumps(token)
            else:
                json.dumps({'error': 'invalid login'})
        try:
            # raises a Validation error if the request isn't authorized
            if 'username' in request.cookies and 'atoken' in request.cookies:
                request.cookies['action'] = 'login'
                check_auth(request.cookies['username'], 
                    request.cookies['atoken'])
                username = request.cookies['username']
            else:
                check_auth(content['username'], content['atoken'])
                username = content['username']
        except AuthError:
            print('AuthError, invalid credentials')
            return json.dumps({'error': 'invalid credentials'})

        response = make_response(select_operation(content))
        response.set_cookie('uuid', uuid)
        response.set_cookie('username', username)
        response.set_cookie('atoken', LoginToken.create_one(username))
        return response
    return operate_users()

###

def select_operation(content):
    print('select operation action')
    if content['action'] == 'create':
        return User.create_one(content['username'], content['password'])
    # TODO(buckbaskin): implement the rest of the user API here
    elif content['action'] == 'login':
        print('login action')
        if User.check_password(content['username'], content['password']):
            token = LoginToken.create_one(content['username'])
            return json.dumps(token)
        else:
            json.dumps({'error': 'invalid login'})
    return json.dumps({'error': 'invalid operation'})

###
