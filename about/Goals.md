# Features For the Notary App

## Implementation:

At each level, make it, break it, write tests that fail when it is broken, fix the tests.
- Make it is release at x.y.0
- Break a thing, with tests to show it is broken at x.y.1-alpha (Flask: http://flask.pocoo.org/docs/0.10/testing/, JavaScript: https://netbeans.org/kb/docs/webclient/html5-js-support.html)
- Fix the tests, release at x.y.1
- Repeat for each break, incrementing bugfix/minor
Increment feature/middle for each feature set below
Major version is first release of nice interface (1.0.0) which will freeze all APIs (no deletion/removal of functionality until a v2 milestone is set)


## Versions
### 0.1.0 - Basics
- syncing notes with title, "meta" and content
- Create date, last updated date and due date
- make meta data list a dict that includes the tag list, but also date created, etc.

### 0.2.0 - Clone back end, "front end"
- match functionality of exposed Evernote API
- web interface that does basic note creation

### 0.3.0- Hidden HTML 1, versions and sharing
- text formatting: bold, italics, underline, strikethrough, highlighting, 2 fonts to demo options, left/center/right align
- save point versioning of notes. Start and end of every user editing session (no edits for >5 min or user clicks save?
- note sharing link generator. Creates as public, read only copy of the note at a given point, with option to link to latest version of the note

### 0.4.0 - Organization
- organize notes by notebooks
- a page/tab for managing tags (items in meta data list)
- a page/tab for managing notebooks
- filter notes by notebook
- filter notes by tag

### 0.5.0
- HTML lists, numbered lists from markdown type-out syntax
- Attach files. Included as box with click to download functionality in the note. Somehow serve from website. At this point, note content is backed up by user-hidden HTML generated during saving. Display images in a standard max height, width preserving aspect ratio
- Support file linking to google drive, other web services with a visually similar interface to the attaching files view. At this point, note content is backed up by user-hidden HTML generated during saving

### 0.6.0
- hook into Evernote API
- text search of notes

### 1.0.0 - UI, Undo, Interactive Versioning
- a nice looking interface
- undo redo interactive versioning of notes (every time a user clicks out, or writes x characters, or writes a word?)
- interface to slide through time of note creation and choose the version that suits the user as the current version

### 1.1.0 - Chat
- chat app that goes alongside notes that has a chat app for each note as a channel, and allows commenting/chatting with users viewing the public read note version and the user editing the note. Include links to specific lines of text. Notes may be current version, or fixed in time at the point of creation.

### 1.2.0 - Performance, interactivity, usability speed up, offline functionality
- create a notes cache in the browser that stores all known note information up to 1000 latest notes and use notes from there to populate display. Update the list (FIFO queue) every time the note is updated or interacted with
- when searching for notes, send out a request for the notes that match, but filter existing notes in the browser while waiting for a response and append the response later, then sort it in

### 1.3.0 - Web connectivity
- implement a chrome extension that does web clipping functionality
