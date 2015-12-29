import pymongo

from bson.objectid import ObjectId

client = pymongo.MongoClient('localhost', 27017)
db = client.notary_database

class Schema(object):
    collection = 'default'

    @staticmethod
    def to_mongo():
        return {'version' : 0}

    @staticmethod
    def get_all():
        collection = getattr(db, Schema.collection)
        cursor = collection.find()
        return cursor

    @staticmethod
    def get_one(id_):
        id_ = ObjectId(id_)
        collection = getattr(db, Schema.collection)
        data = collection.find_one({'_id': ObjectId(id_)})
        return data

    @staticmethod
    def update_one(id_):
        # raise error for method not defined
        pass

    @staticmethod
    def create_one():
        # raise error for method not defined
        pass

    @staticmethod
    def remove_one(id_):
        collection = getattr(db, Schema.collection)
        result = collection.delete_many({'_id' : id_})
        return result.deleted_count

class Note(Schema):
    collection = 'notes'
    valid_sorts = {
        'title': 1,
        'meta': 1,
        'content': 1
    }

    @staticmethod
    def to_mongo(title, meta, content, version=0):
        base = Schema.to_mongo()
        add_ = {
            'title': title,
            'meta': meta,
            'content': content
        }
        newm = dict(base, **add_)
        newm['version'] = version

        return newm

    @staticmethod
    def get_all(sort=None):
        collection = getattr(db, Note.collection)
        if sort in Note.valid_sorts:
            if sort[:1] == '-':
                sort = sort[1:]
                order = -1
            else:
                order = 1
            print('sort: '+str(sort)+' order:' +str(order))
            cursor = collection.find().sort([(sort, order)])
        else:
            cursor = collection.find()
        return cursor

    @staticmethod
    def update_one(id_, title, meta, content):
        collection = getattr(db, Note.collection)
        #TODO(buckbaskin): use the unused result to check for errors in update
        _ = collection.update_one({
            '_id' : ObjectId(id_)
        },
        {
            '$set': {
                'title': title,
                'meta' : meta,
                'content': content
            }
        })
        return id_

    @staticmethod
    def get_one(id_):
        id_ = ObjectId(id_)
        collection = getattr(db, Note.collection)
        data = collection.find_one({'_id': ObjectId(id_)})
        return data

    @staticmethod
    def create_one():
        collection = getattr(db, Note.collection)
        result = collection.insert_one(
            Note.to_mongo('New Note', '|', 'begin typing here', 0)
            )
        id_ = result.inserted_id
        return id_
