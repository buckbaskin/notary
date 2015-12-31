# Proposed API Actions (based on Evernote API)

## Authentication Token
A string that is generated from a login, which is then valid for a few minutes and can be sent back to authenticate the application

## Notes

### create notes (`authentication token, list of <note info>`)
Create new notes based on the given information. If nothing is provided, the default note values are instantiated.
- title
- meta
- content
- public share
- private share
Returns the list of `<new note id>s`

### copy note (`atoken, note id, target Notebook`)
Copy the existing note to the target notebook
Returns the new note id

### get note offset (`atoken, note id, note set`)
Find the position of a note in the given set. A set is a combinations of a notebook (1 or 0) and arbitrarily many tags, and ordered by a given attribute (default is last updated). A note set contains:
- notebook: notebook guid
- tags: list of tag ids
- sort: sort order (title, meta, content, created, updated)
- sort ascending: 1 or -1
Returns the integer offset (0 for first note)

### get note ids (`atoken, set`)
Find the notes that are in the set. A set is a combinations of a notebook (1 or 0) and arbitrarily many tags, and ordered by a given attribute (default is last updated). A note set contains:
- notebook: notebook guid
- tags: list of tag ids
- sort: sort order (title, meta, content, created, updated)
- sort ascending: 1 or -1
Returns a list of the ids of notes in the set.

### get notes (`atoken, list of <note id>`)
Returns the note title, metadata and contents as a json object.

### get note by version (`atoken, <note id>, version`)
Returns the note at the specified version. version is an incrementing integer, and invalid version defaults to latest version.

### get note versions (`atoken, list of <note id>`)
Returns a list of the maximum version of the given note ids.

### get notes sharing info (`atoken, list of <note id>`)
Return a list of pairs of [private, public] share link strings. If they are empty, the note is note shared that way.

### get searchable notes (`atoken, list of <note id>, options`)
Options:
- delimiter: delimiter string
- as list: returns a list instead of delimited string
- tokens: returns as a dict of tokens, with their count
Returns a space delimited version of the note that is designed to be indexed or searched on the client. This can be converted to a list of tokens by spliting on the spaces.

### update notes (`atoken, list of <note info>`)
Push the provided info into the given note.
Returns `{ 'results' : number of successful updates }`

### trash notes (`atoken, list of <note id>`)
Send the given notes to the trash
Returns `{ 'results' : number of successful notes trashed }`

### email notes (`atoken, email info, list of <note id>`)
Send the given notes to the given email address
Returns `{ 'results' : number of successful notes emailed }`


## Notebooks

### create notebook (`atoken, notebook info`)
Create a new notebook based on the given information including:
- notebook name
- username
- public share: option to set if the notebook should be publicly available (read-only access)
- private share: option to set if the notebook should be privately shareable
Returns the new notebook id

### get notebook id (`atoken, name`)
Get the unique id of the notebook with the given name
Returns the id

### get notebook (`atoken, notebook id`)
Get all the metadata for the notebook. Use the get notes set functionality to get the notes in the notebook.

### get notebook sharing info (`atoken, notebook id`)
Return a pair of [private, public] share link strings. If they are empty, the notebook is note shared that way.

### get searchable notebook (`atoken, notebook id, option`)
Options:
- delimiter: delimiter string
- as list: returns a list instead of delimited string
- tokens: returns as a dict of tokens, with their count
Returns the searchable form of the notebook information (does note include)

### get searchable notebooks (`atoken, list of <notebook id>, options`)
Options:
- delimiter: delimiter string
- as list: returns a list instead of delimited string
- tokens: returns as a dict of tokens, with their count
Returns a space delimited version of the note that is designed to be indexed or searched on the client. This can be converted to a list of tokens by spliting on the spaces.

### update notebook (`atoken, notebook info`)
Push the provided info into the given note.
Returns `{ 'results' : number of successful updates }`

### trash notebook (`atoken, <notebook id>`)
Send the given notebook to the trash
Returns `{ 'results' : number of successful notebooks trashed }`


## Tags

### create tag(atoken, tag info)
Create a new tag
- name
- parent id

### trash tag (atoken, note id)
Send the given tag to the trash

## Searches

### create saved search(atoken, search info)
Create a new saved search with a given name and query
- name
- query
Returns the search id

### trash search (atoken, note id)
Send the given search to the trash

## Trash
Trash is a special "notebook" that has all trashed notes, notebooks, tags, searches. These can all be restored or permanently deleted.

### delete note(atoken, note id)
If the note is in the trash, delete it

### delete notebook (atoken, note id)
Delete the given notebook

### delete trash(atoken)
Delete all notes in the trash notebook