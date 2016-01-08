import sys
if not '/home/buck/Github/notary' in sys.path:
    sys.path.append('/home/buck/Github/notary')

from db import Schema, database
import datetime
from bson.objectid import ObjectId

class Note(Schema):
    collection = 'notes'
    valid_sorts = {
        'title': 1,
        'meta': 1,
        'content': 1
    }

    @staticmethod
    def to_mongo(username, title, meta, content, version=0,
                 created=datetime.datetime.utcnow()):
        base = Schema.to_mongo()
        add_ = {
            'username': username,
            'title': title,
            'meta': {
                'tags': meta['tags'],
                'created': created,
                'updated': datetime.datetime.utcnow(),
                'due_date': None
            },
            'content': content,
        }
        newm = dict(base, **add_)
        newm['version'] = version
        print('newm from to_mongo: ', newm)
        return dict(newm)

    @staticmethod
    def get_all(sort=None):
        collection = getattr(database, Note.collection)
        if sort in Note.valid_sorts:
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
        collection = getattr(database, Note.collection)
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
    def get_one(id_):
        id_ = ObjectId(id_)
        collection = getattr(database, Note.collection)
        data = collection.find_one({'_id': ObjectId(id_)})
        return data

    @staticmethod
    def create_from_object(note_obj, username):
        collection = getattr(database, Note.collection)
        # note_obj = dict(note_obj)
        # print('type of note_obj, ', type(note_obj))
        # if 'title' not in note_obj:
        #     note_obj['title'] = 'New Note'
        # if 'meta' not in note_obj:
        #     meta = {}
        #     meta['tags'] = []
        # if 'content' not in note_obj:
        #     content = 'Take notes here'
        # note_obj['meta']['version'] = 0
        # note_obj['meta']['created'] = datetime.datetime.utcnow()
        print('create_from_object 1', type(note_obj))
        indicial_craziness_factorial = {
        'title': 'New Note',
        'meta': {'tags': []},
        'content': 'begin typing here'
        }
        if 'title' in note_obj:
            indicial_craziness_factorial['title'] = note_obj['title']
        if 'meta' in note_obj:
            indicial_craziness_factorial['meta'] = note_obj['meta']
        if 'content' in note_obj:
            indicial_craziness_factorial['content'] = note_obj['content']
        print('create_from_object 3')
        result = collection.insert_one( indicial_craziness_factorial )
        id_ = result.inserted_id
        print('create_from_object 2 id')
        return str(id_)

    # @staticmethod
    # def create_one():
    #     collection = getattr(database, Note.collection)
    #     result = collection.insert_one(
    #         Note.to_mongo('New Note', '|', 'begin typing here', 0)
    #         )
    #     id_ = result.inserted_id
    #     return id_
