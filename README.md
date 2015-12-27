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

- Make meta a list of tags, displayed as comma separated, or squares/rectangles?
- sync attempts to push changes first, then pull changes
- add error handling/tracking. If a request is made where the function returns an error, it is recorded in the engagement.
- convert the api to send the note information as inforamtion in the post, and based on what information is in the post data, update/create/delete a note.
- when returning the get all information in python, allow post or get tag to specify what the ordering is (default is last updated first, but if there is a valid field specified in the post, get all)
  - sort the array in javascript so that last updated, is first, or last created, that kind of thing
- add in a script for viewing the aggregate information on page accesses/traced functions in the app. Non-GUI for now.
- make a queue of changes to be sent to the server, while using the note selector list as a variable to maintain the current state
  - make an indicator when a note has unsaved changes waiting to go to the server instead of briefly indicating that the note was saved. or maybe both
- update bootstrap colors to make it light blue on dark blue color scheme (for everything except the text?)
- add in a script for viewing the aggregate information on page accesses/traced functions in the app. GUI/Interactive, matplotlib?
  - color by function return (green for page, blue for json, orange for null, red for error)

# TODO to-sort
- add in a scope variable for managing the in-javascript variables
- add a date-created, date-last-updated field to the note specification
- set the id of each element in the list as the html id for the content where its easy to replace all the information. This will make it easy to getElementById, and insert innerHtml. Only update the individual html content instead of the entire list.