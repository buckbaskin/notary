import pymongo

from bson.objectid import ObjectId

client = pymongo.MongoClient('localhost', 27017)
db = client.notary_database

class Schema(object):
    collection = 'default'

    def to_mongo(self):
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

    @staticmethod
    def to_mongo(title, meta, content, version=0):
        base = super(Note, self).to_mongo()
        add_ = {
            'title': title,
            'meta': meta,
            'content': content
        }
        newm = dict(base.items() + add_.items())
        newm['version'] = version

        return newm

    @staticmethod
    def update_one(id_, title, meta, content):
        collection = getattr(db, Note.collection)
        result = collection.update_one({
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
        print('data: '+str(data))
        return data

    @staticmethod
    def create_one():
        collection = getattr(db, Note.collection)
        result = collection.insert_one(
            self.to_mongo('New Note', '', '', 0)
            )
        id_ = result.inserted_id
        return id_