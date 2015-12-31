# Proposed API Actions (based on Evernote API)

## Notes

### create note (`atoken, list of <note info>`)
Create new notes based on the given information. If nothing is provided, the default note values are instantiated.
- title
- meta
- content
- public share
- private share
Returns the list of `<new note id>s`

### copy note (`authentication token, note id, target Notebook`)
Copy the existing note to the target notebook
Returns the new note id

## update notes (`atoken, list of <note info>`)
Push the provided into into the given note
Returns `{ 'results' : number of successful updates }`

### trash notes (`atoken, list of <note id>`)
Send the given notes to the trash
Returns `{ 'results' : number of successful updates }`

## Notebooks

### create notebook (atoken, notebook info)
Create a new notebook based on the given information including:
- notebook name
- username
- public share: option to set if the notebook should be publicly available (read-only access)
- private share: option to set if the notebook should be privately shareable
Returns the new notebook id

### trash notebook (atoken, note id)
Send the given notebook to the trash

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