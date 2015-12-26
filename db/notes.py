from db.schema import Note

client = pymongo.MongoClient('localhost', 27017)
db = client.notary_database

def get_all_notes():
	return Note.get_all(db)

def get_all(schema):
	collection = getattr(db, schema.collection)
	cursor = collection.find()
	return cursor

def get_one_note(id_):
	val = collection.find_one({'id_': id_})
	print 'type?: '+str(type(val))
	print 'val  : '+str(val)
	return val

def update_note(id_, title, meta, content):
	pass

def new_note():
	pass