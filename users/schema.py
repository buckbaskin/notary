from db import Schema, database
from werkzeug.security import generate_password_hash, check_password_hash
from bson.objectid import ObjectId
import random

database.user.create_index('username')

class User(Schema):
    collection = 'user'
    valid_sorts = {
        'username': 1,
        'created': 1,
        'logged_in': 1
    }

    @staticmethod
    def to_mongo(username, password, created, logged_in):
        base = Schema.to_mongo()
        add_ = {
            'username': username,
            'meta': {
                'created': created,
                'logged_in': logged_in
            }
        }
        newm = dict(base, **add_)
        del newm['version']

        if password is not None:
            # on create
            # TODO(buckbaskin): do something other than plain text
            # validate then hash the password
            newm['password_hash'] = generate_password_hash(password)

        return newm

# TODO(buckbaskin): Start here, finish User Schema from example Notes schema

    @staticmethod
    def get_all(sort=None):
        collection = getattr(database, User.collection)
        if sort in User.valid_sorts:
            if sort[:1] == '-':
                sort = sort[1:]
                order = -1
            else:
                order = 1
            print('sort: ' + str(sort) + ' order:' + str(order))
            cursor = collection.find().sort([(sort, order)])
        else:
            cursor = collection.find()
        return cursor

    @staticmethod
    def update_one(id_, title, meta, content):
        collection = getattr(database, User.collection)
        # TODO(buckbaskin): use the unused result to check for errors in update

        # use this to update old style metadata to new form factor
        if isinstance(meta, (list, )):
            meta_ = {}
            meta_['tags'] = list(meta)
            meta = dict(meta_)
        if 'due_date' not in meta:
            meta['due_date'] = None
        if 'created' not in meta:
            meta['created'] = datetime.datetime.utcnow()
        if 'updated' not in meta:
            meta['updated'] = datetime.datetime.utcnow()

        _ = collection.update_one({
            '_id': ObjectId(id_)
            },
            {
                '$set': {
                    'title': title,
                    'meta': meta,
                    'content': content
                }
            })
        _ = collection.update_one({
            '_id': ObjectId(id_)
            },
            {
                '$currentDate': {
                    'meta.updated': True
                }
            })
        return id_

    @staticmethod
    def get_by_username(username):
        collection = getattr(database, User.collection)
        cursor = collection.find({'username': username})
        for user in collection:
            return user
        return None

    @staticmethod
    def check_password(username, password):
        user = get_by_username(username)
        if user is not None:
            return check_password_hash(user['password_hash'], password)
        return False

    @staticmethod
    def get_one(id_):
        id_ = ObjectId(id_)
        collection = getattr(database, User.collection)
        data = collection.find_one({'_id': ObjectId(id_)})
        return data

    @staticmethod
    def create_one(username, password):
        # check to see if the username is unique
        if get_by_username(username) is None:
            return None
        collection = getattr(database, User.collection)
        result = collection.insert_one(
            User.to_mongo(username, password, created=datetime.datetime.utcnow(), logged_in=datetime.datetime.utcnow())
        )
        id_ = result.inserted_id
        return id_

class LoginToken(Schema):
    collection = 'logintoken'

    @staticmethod
    def to_mongo(username, token, created):
        return {
            'username': username,
            'token': token,
            'created': created
        }

    @staticmethod
    def create_one(username):
        collection = getattr(database, LoginToken.collection)
        token = ''.join(random.choice('abcdefghijklmnopqrstuvwxyz0123456789') for i in range(64))
        result = collection.insert_one(
            LoginToken.to_mongo(username, token, datetime.datetime.utcnow())
        )
        return token

    @staticmethod
    def check_token(username, token):
        collection = getattr(database, LoginToken.collection)
        cursor = collection.find({'username': username, 'token': token})
        for token in cursor:
            if (datetime.datetime.utcnow() - token['created']).total_seconds() < 300:
                return True
        return False
