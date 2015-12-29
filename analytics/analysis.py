import pymongo

client = pymongo.MongoClient('localhost', 27017)
db = client.notary_database
collection = db.access

fnames = {}

for record in collection.find():
	if record['function-name'] not in fnames:
		fnames[record['function-name']] = 0
	fnames[record['function-name']] += 1

for name, count in fnames.items():
	print('function %s was called %d times' % (name, count))