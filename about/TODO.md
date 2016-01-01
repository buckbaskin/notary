#TODO

Server Side
- Add in a User schema. Users have username, password, created date, last login date, user id
- Add in user tokens, which are generated and tracked, and expire every couple of minutes of inactivity or every 24 hours if the user is continuously active. Each login returns a token to the client. The token last active gets refreshed every time the API makes a request, except if its been 24 hours. The client sends its most recent token, and if it is expired, the server responds with a login page.
- Add in a Notebook schema
- Add in a Tag schema
- Add in a search 
- Add in new API functionality methods

Client Side
- make a queue of changes to be sent to the server, while using the note selector list as a variable to maintain the current state
  - make an indicator when a note has unsaved changes waiting to go to the server instead of briefly indicating that the note was saved. or maybe both
- update bootstrap colors to make it light blue on dark blue color scheme (for everything except the text?)
- add in a scope variable for managing the in-javascript variables
- set the id of each element in the list as the html id for the content where its easy to replace all the information. This will make it easy to getElementById, and insert innerHtml. Only update the individual html content instead of the entire list.
- after implementing the scope object, update view every time the hash of the object changes? or override set attribute to update the view
  - I wouldn't mind running the hash check every second or so, and then updating the view. This might be nice to pair with the async push changes queue

Server Side
- add in a script for viewing the aggregate information on page accesses/traced functions in the app. GUI/Interactive, matplotlib?
  - color by function return (green for page, blue for json, orange for null, red for error)
- use flask-sessions/cookies to track which users are making which requests/accesses
  - modify the analysis script to sort accesses by user ID

Client Side
- process date into a human readable short version, ex. Mar 5, 2015, human readable long version, ex. 2:15pm Mar 5, 2015 in Javascript

# TODO to-sort
