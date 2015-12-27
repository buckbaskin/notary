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
- store the current title, meta, content as a variable in the javascript, which is updated then pushed into the html
  - do this for the entire list, and update the inforamtion locally in the process of saving it (i.e. update the list locally)
  - set the id of each element in the list as the html id for the content where its easy to replace all the information. This will make it easy to getElementById, and insert innerHtml
- add error handling/tracking. If a request is made where the function returns an error, it is recorded in the engagement.
- add in a script for viewing the aggregate information on page accesses/traced functions in the app.
- update bootstrap colors to make it light blue on dark blue color scheme (for everything except the text?)