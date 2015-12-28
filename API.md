# API Documentation

### /

Home page

## Notes

### /notes, GET

Returns the HTML page for the notes single-page web app

### /n.json GET

Returns a json object with all of the notes. In future versions, this may become paginated, or deprecated in favor of using the POST endpoint.

### /n.json POST

Based on the content of the JSON posted, this can perform a variety of operations, including:
- Create: ex. {'action': 'create'}. Returns the new note id.
- Read: {'action': 'read', ... } guesses read type based on data. Order of precedence
  - Read One: ex. {'action': 'readone', '_id': '57a...'}
  - Read Many: ex. {'action': 'readmany', 'sort_by': 'date', 'page':0, 'count': 100 }
    - sort_by: 'title', 'meta', 'content', 'created', 'updated'. default is 'title'
    - page: if there are more than the specified count, chose which page to render. If it is invalid, choose 0.
    - count: number of notes to return. Max 100. Note, count is not yet implemented.
- Update: {'action': 'update', 'notes': [ list of note objects to save/update ] }. Returns empty string
- Delete: {'action': 'delete', 'ids' : [ list of note ids to delete ] }. Returns empty string