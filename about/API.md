# API Documentation

### ```/```

Home page

## Notes

### ```/notes```, GET

Returns the HTML page for the notes single-page web app

### ```/n.json``` GET - Deprecated, won't be valid in v1

Returns a json object with all of the notes. In future versions, this may become paginated, or deprecated in favor of using the POST endpoint.

### ```/n.json``` POST

Based on the content of the JSON posted, this can perform a variety of operations, including:
- Create: ex. ```{'atoken': [username, token] , 'action': 'create', 'notes': [list of partial note objects] }```. If the atoken pair matches, create a note for each note object based on the information passed in for the user. If there is missing information in the given object, the default value will be filled in instead.

- Read: ```{'action': 'read', ... } guesses read type based on data. Order of precedence
  - Read One: ex. ```{'action': 'readone', '_id': '57a...'}```
  - Read Many: ex. ```{'action': 'readmany', 'sort_by': 'date', 'page':0, 'count': 100 }```
    - ```sort_by```: 'title', 'meta', 'content', 'created', 'updated'. default is 'title'
    - ```page```: if there are more than the specified count, chose which page to render. If it is invalid, choose 0.
    - ```count```: number of notes to return. Max 100. Note, count is not yet implemented.
- Update: ```{'action': 'update', 'notes': [ list of note objects to save/update ] }```. Returns {'response': 'success'}
- Delete: ```{'action': 'delete', 'ids' : [ list of note ids to delete ] }```. Returns {'response': 'success'}

### ```/u.json``` POST

Based on the content of the JSON posted, this can perform a variety of operations, including:
- Create: ex. ```{'action': 'create', 'username': ..., 'password': ...}```. Creates a new user if the username is unique, and it will return the new user id, or an empty response if the username is taken.
- Read: ex. ```{'action': 'read', 'atoken': ..., 'username': 'username'}```. If the auth token matches the username, the server will return the user object to the client in JSON form. 
- Login: ex. ```{'action': 'login', 'username': ..., 'password': ...}```. Creates a new login token, and returns it. This will be useful for 5 minutes, and will be renewed each time a request is sent to the server up to a point where it has been logged in too long and require a new login.
- Update: ex. ```{'action': 'update', 'atoken': ..., 'user': { note object } }```. If the auth token matches the user object, the server will update the user object and return the new version to the client in JSON form.
- Delete: ex. ```{'action': 'delete', 'atoken': ..., 'username': ... }```. If the auth token matches the user, the user will be removed from the system.