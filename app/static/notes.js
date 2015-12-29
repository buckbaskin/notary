"use strict";

var notes = [];
var sortBy = "title";
var title = "";
var meta = [];
var content = "";
if (window.id_ === undefined) {
  var id_ = "567dff3599b4971e04354410";
}

function request(request, type, url, action, send) {
  var xmlhttp = new XMLHttpRequest();
  
  xmlhttp.open(request, url, true);
  if (type === "json") {
    xmlhttp.setRequestHeader("Content-Type", "application/json");
  }

  xmlhttp.onreadystatechange = function () {
    action(xmlhttp);
  };

  xmlhttp.send(send);
}

function postNoteJSON(id_, title, meta, content) {
  var myNote = {
    "title" : title,
    "meta" : meta,
    "content" : content
  };
  var myData = {
    'action': 'update', 
    'notes': [ myNote ]
  };
  var myJson = JSON.stringify(myData);
  
  request("POST", "json", "/n.json", function(res) {
    if (res.readyState === 4 && res.status === 200) {
      var fromJSON = JSON.parse( res.responseText );
      console.log(fromJSON);
      id_ = fromJSON._id;
      document.getElementById("note-title").innerHTML = fromJSON.title;
      document.getElementById("note-meta").innerHTML = fromJSON.meta;
      document.getElementById("note-content").innerHTML = fromJSON.content;
      console.log("returned values were set");
    }
  }, myJson);
}

function updateListItem(id_, title, meta, content) {
  for (var i = window.notes.length - 1; i >= 0; i--) {
    if (window.notes[i]._id === id_) {
      
      window.notes[i].title = title;
      window.notes[i].meta = meta;
      window.notes[i].content = content;
      
      console.log("note data pushed into the local list");
      return;
    }
  }
}

function displaySaved() {
  document.getElementById("saved").innerHTML = " - Saved";
  setTimeout(function() {
    document.getElementById("saved").innerHTML = "";
  }, 1000);
}

/* jshint ignore:start */
function buildNotePreviewToHtml(id_, title, meta, content) {
  var str_ = `<div id="${id_}" class="row note-preview" onclick="loadNote( \'${id_}\' );">`;
  str_ = str_ + '<div class="intro-line">';
  str_ = str_ + '<h4>'+title+'</h4>';
  str_ = str_ + '<p> - |' + meta+ '|' +content +'|</p>';
  str_ = str_ + '</div></div>';
  return str_;
}
/* jshint ignore:end */

function updateListView() {
  console.log("updating note-selector view");
  var accum = "";
  var str_ = "";
  for (var i = 0; i < notes.length; i++) {
    var note1 = notes[i];
    str_ = buildNotePreviewToHtml( // jshint ignore:line
      note1._id, note1.title, note1.meta, note1.content
    );
    accum = accum + str_;
  }
  document.getElementById("notes-list").innerHTML = accum;
}

function sortNotesByAttr(attr) {
  window.sortBy = attr;
  if (attr === "title" || attr === "content") {
    notes = notes.sort(function(a, b) {
      if (a[attr] > b[attr]) {
        return 1;
      } else if (a[attr] === b[attr]) {
        return 0;
      } else {
        return -1;
      }
    });
  }
  if (attr === "meta") {
    notes = notes.sort(function(a, b) {
      if (a.meta[0] > b.meta[0]) {
        return 1;
      } else if (a.meta[0] === b.meta[0]) {
        return 0;
      } else {
        return -1;
      }
    });
  }
  updateListView();
}

function syncNotes() {
  
  var data = { 
    "action": "update", 
    "notes": notes
  };
  var myJson = JSON.stringify(data);

  console.log("sync push");

  request("POST", "json", "/n.json", function(res) {
    if (res.readyState === 4 && res.status === 200) {
      var response = JSON.parse( res.responseText );
      if (response.response !== "success") {
        console.log('sync push error');
      }
    }
  }, myJson);

  console.log("sync pull");

  var control = {
    "action": "readmany",
    "sort_by": sortBy,
    "page": 0,
    "count": 100
  };
  var controlJson = JSON.stringify(control);

  request("POST", "json", "/n.json", function(res) {
    if (res.readyState === 4 && res.status === 200) {
      var notesFromJSON = JSON.parse( res.responseText );
      if (window.notes === undefined) {
        window.notes = [];
      }
      notes = notesFromJSON;
      if (window.sortBy !== undefined) {
        sortNotesByAttr(sortBy);
      }
      // console.log(notes);
      updateListView();
    }
  }, controlJson);
}

function stringToMeta(req) {
  var res = req.split(", ");
  // console.log(res[res.length-1]);
  var meter = [];
  for (var i = 0; i < res.length; i++) {
    if (res[i] !== "") {
      meter.push(res[i]);
    }
  }
  return meter;
}

function saveAllEdits() {
  var title = document.getElementById("note-title").innerHTML;
  var metaStr = document.getElementById("note-meta").innerHTML;
  var meta = stringToMeta(metaStr);
  var count = document.getElementById("note-content").innerHTML;

  postNoteJSON(id_, title, meta, count);
  updateListItem(id_, title, meta, count);
  displaySaved();
  syncNotes();
}

function createNewNote() {
  syncNotes();
  
  var data = { "action": "create" };
  var myJson = JSON.stringify(data);
  
  request("POST", "json", "/n.json", function(res) {
    if (res.readyState === 4 && res.status === 200) {
      var fromJSON = JSON.parse( res.responseText );
      // console.log(fromJSON);
      id_ = fromJSON._id;
      document.getElementById("note-title").innerHTML = fromJSON.title;
      document.getElementById("note-meta").innerHTML = fromJSON.meta;
      document.getElementById("note-content").innerHTML = fromJSON.content;
      console.log("returned values were set");
    }
  }, myJson);

  syncNotes();
}

function metaToString(req) {
  var res = "";
  for (var i = 0; i < req.length; i++) {
    res = res+req[i] + ", ";
  }
  return res;
}

function refreshView() {
  if (window.title !== undefined) {
    document.getElementById("note-title").innerHTML = title;
  }
  if (window.meta !== undefined) {
    document.getElementById("note-meta").innerHTML = metaToString(meta);
  }
  if (window.content !== undefined) {
    document.getElementById("note-content").innerHTML = content;
  }
  console.log("view updated");
}

function loadNote(newId) {
  syncNotes();
  if (window.sortBy !== undefined) {
    sortNotesByAttr(sortBy);
  }
  if (window.notes !== undefined) {
    for (var i = window.notes.length - 1; i >= 0; i--) {
      var noteCandidate = window.notes[i];
      if (noteCandidate._id === newId) {
        id_ = newId;
        title = noteCandidate.title;
        meta = noteCandidate.meta;
        content = noteCandidate.content;
        console.log("returned values were set from local values");
        refreshView();
        return;
      }
    }
  }

  var data = { "action":"readone", "_id": newId };
  var myJson = JSON.stringify(data);

  request("POST", "json", "/n.json", function(res) {
    if (res.readyState === 4 && res.status === 200) {
      var fromJSON = JSON.parse( res.responseText );
      // console.log(fromJSON);
      id_ = fromJSON._id;
      title = fromJSON.title;
      meta = fromJSON.meta;
      content = fromJSON.content;
      refreshView();
      console.log("returned values were set");
    }
  }, myJson);
}