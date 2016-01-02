import pymongo

from bson.objectid import ObjectId

client = pymongo.MongoClient('localhost', 27017)
db = client.notary_database

import sys
if not '/home/buck/Github/notary' in sys.path:
    sys.path.append('/home/buck/Github/notary')

class Schema(object):
    collection = 'default'

    @staticmethod
    def to_mongo():
        return {'version': 0}

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
        result = collection.delete_many({'_id': id_})
        return result.deleted_count

# class Note(Schema):
#     collection = 'notes'
#     valid_sorts = {
#         'title': 1,
#         'meta': 1,
#         'content': 1
#     }

#     @staticmethod
#     def to_mongo(title, meta, content, version=0,
#                  created=datetime.datetime.utcnow()):
#         base = Schema.to_mongo()
#         add_ = {
#             'title': title,
#             'meta': {
#                 'tags': meta['tags'],
#                 'created': created,
#                 'updated': datetime.datetime.utcnow(),
#                 'due_date': None
#             },
#             'content': content,
#         }
#         newm = dict(base, **add_)
#         newm['version'] = version

#         return newm

#     @staticmethod
#     def get_all(sort=None):
#         collection = getattr(db, Note.collection)
#         if sort in Note.valid_sorts:
#             if sort[:1] == '-':
#                 sort = sort[1:]
#                 order = -1
#             else:
#                 order = 1
#             print('sort: ' + str(sort) + ' order:' + str(order))
#             cursor = collection.find().sort([(sort, order)])
#         else:
#             cursor = collection.find()
#         return cursor

#     @staticmethod
#     def update_one(id_, title, meta, content):
#         collection = getattr(db, Note.collection)
#         # TODO(buckbaskin): use the unused result to check for errors

#         # use this to update old style metadata to new form factor
#         if isinstance(meta, (list, )):
#             meta_ = {}
#             meta_['tags'] = list(meta)
#             meta = dict(meta_)
#         if 'due_date' not in meta:
#             meta['due_date'] = None
#         if 'created' not in meta:
#             meta['created'] = datetime.datetime.utcnow()
#         if 'updated' not in meta:
#             meta['updated'] = datetime.datetime.utcnow()

#         _ = collection.update_one({
#             '_id': ObjectId(id_)
#             },
#             {
#                 '$set': {
#                     'title': title,
#                     'meta': meta,
#                     'content': content
#                 }
#             })
#         _ = collection.update_one({
#             '_id': ObjectId(id_)
#             },
#             {
#                 '$currentDate': {
#                     'meta.updated': True
#                 }
#             })
#         return id_

#     @staticmethod
#     def get_one(id_):
#         id_ = ObjectId(id_)
#         collection = getattr(db, Note.collection)
#         data = collection.find_one({'_id': ObjectId(id_)})
#         return data

#     @staticmethod
#     def create_one():
#         collection = getattr(db, Note.collection)
#         result = collection.insert_one(
#             Note.to_mongo('New Note', '|', 'begin typing here', 0)
#             )
#         id_ = result.inserted_id
#         return id_
