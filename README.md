# notary
Evernote clone based on a Flask/Python back end

## to check what pages are being accessed:

```
$ python
>>> import pymongo
>>> client = pymongo.MongoClient('localhost', 27017)
>>> db = client.notary_database
>>> records = db.access
>>> records.find_one()
```

Note: there needs to be a running MongoDB instance
To run the instance:
```
$ mongod --smallfiles --dbpath ./data/db
```