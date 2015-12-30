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

- add a date-created, date-last-updated field to the note specification
  - include a human readable short version, ex. Mar 5, 2015
  - include a human readable long version, ex. 2:15pm Mar 5, 2015
- make a queue of changes to be sent to the server, while using the note selector list as a variable to maintain the current state
  - make an indicator when a note has unsaved changes waiting to go to the server instead of briefly indicating that the note was saved. or maybe both
- update bootstrap colors to make it light blue on dark blue color scheme (for everything except the text?)
- add in a scope variable for managing the in-javascript variables
- set the id of each element in the list as the html id for the content where its easy to replace all the information. This will make it easy to getElementById, and insert innerHtml. Only update the individual html content instead of the entire list.
- add in a script for viewing the aggregate information on page accesses/traced functions in the app. GUI/Interactive, matplotlib?
  - color by function return (green for page, blue for json, orange for null, red for error)

# TODO to-sort
- after implementing the scope object, update view every time the hash of the object changes? or override set attribute to update the view
  - I wouldn't mind running the hash check every second or so, and then updating the view. This might be nice to pair with the async push changes queue
- use flask-sessions/cookies to track which users are making which requests/accesses
  - modify the analysis script to sort accesses by user ID
- implement users (in Mongo for now). Users have a username, password, email?, created date, last login date, unique user id
