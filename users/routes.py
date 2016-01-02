from app import server
from flask import render_template
from flask import request

import json
import dateutil.parser as dateparser

import analytics
from db import Note

##### Users #####

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
    return ''