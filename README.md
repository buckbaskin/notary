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

## Remember: use venv
```
$ source venv/bin/activate
```

## To run the server:
```
$ cd .../notary
$ python run.py
```

#TODO

- Make the notes sync work (get the json, update the list). This won't be done on the first one, because the templating is faster?
- Make meta a list of tags, displayed as comma separated, or squares/rectangles?
- store the current title, meta, content as a variable in the javascript, which is updated then pushed into the html
- add error handling/tracking. If a request is made where the function returns an error, it is recorded in the engagement.
- add in a script for viewing the aggregate information on page accesses/traced functions in the app.