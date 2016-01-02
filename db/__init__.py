from db.schema import Schema

import pymongo
client = pymongo.MongoClient('localhost', 27017)
database = client.notary_database

from notes.schema import Note
from users.schema import User

# WIP | Future TODO: programatically import all schemas in the top level directory

# import os
# import importlib

# top_level = next(os.walk('.'))[1]

# for pack in top_level:
#     if pack == 'db' or pack[:1] == '.':
#         continue
#     print(str(pack))
#     for file_ in next(os.walk(pack))[2]:
#         if file_ == 'schema.py':
#             print('found schema in '+str(pack))
#             importlib.import_module('notes.schema')
#             importlib.import_module('*', str(pack)+'.schema')