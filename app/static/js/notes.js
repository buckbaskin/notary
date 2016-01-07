"use strict";
/* globals $cope: true */

function __notes(oldScope) {
  $cope = oldScope.clone(oldScope);
  $cope.notes = [];
  $cope.sortBy = "title";
  $cope.title = "";
  $cope.meta = {
    "tags" : [],
    "created" : Date.now(),
    "updated" : Date.now(),
    "due_date" : undefined
  };
  $cope.content = "";
  if ($cope.id_ === undefined) {
    $cope.id_ = "567dff3599b4971e04354410";
  }
  $cope.token = "";
  $cope.username = "";

  $cope.request = function(request, type, url, action, send) {
    var xmlhttp = new XMLHttpRequest();
    
    xmlhttp.open(request, url, true);
    if (type === "json" || true) {
      xmlhttp.setRequestHeader("Content-Type", "application/json");
    }

    xmlhttp.onreadystatechange = function() {
      action(xmlhttp);
    };

    xmlhttp.send(send);
  };

  $cope.metaToTags = function(meta) {
    var tags = meta.tags;
    return tags.join(", ");
  };

  $cope.metaToString = function(req) {
    // var createdStr = req.created;
    // var updatedStr = req.updated;
    // var dueDateStr = req.due_date; // jshint ignore:line
    var res = $cope.metaToTags(req);
    return res;
  };

  $cope.refreshView = function() {
    if ($cope.title !== undefined) {
      document.getElementById("note-title").innerHTML = $cope.title;
    }
    if ($cope.meta !== undefined) {
      document.getElementById("note-meta").innerHTML = $cope.metaToString($cope.meta);
    }
    if ($cope.content !== undefined) {
      document.getElementById("note-content").innerHTML = $cope.content;
    }
    console.log("view updated");
  };

  $cope.postNoteJSON = function(id_, title, meta, content) {
    var myNote = {
      "title" : title,
      "meta" : meta,
      "content" : content
    };
    var myData = {
      "action": "update", 
      "notes": [ myNote ]
    };
    var myJson = JSON.stringify(myData);
    
    $cope.request("POST", "json", "/n.json", function(res) {
      console.log('callback');
      console.log(res);
      if (res.readyState === 4 && res.status === 200) {
        var fromJSON = JSON.parse( res.responseText );
        $cope.id_ = fromJSON._id;
        $cope.title = fromJSON.title;
        $cope.meta = fromJSON.meta;
        $cope.content = fromJSON.content;
        $cope.refreshView();
      }
    }, myJson);
  };

  $cope.updateListItem = function(id_, title, meta, content) {
    for (var i = $cope.notes.length - 1; i >= 0; i--) {
      if ($cope.notes[i]._id === id_) {

        $cope.notes[i].title = title;
        $cope.notes[i].meta = meta;
        $cope.notes[i].content = content;
        
        console.log("note data pushed into the local list");
        return;
      }
    }
  };

  $cope.displaySaved = function() {
    document.getElementById("saved").innerHTML = " - Saved";
    setTimeout(function() {
      document.getElementById("saved").innerHTML = "";
    }, 1000);
  };

  $cope.buildNotePreviewToHtml = function(id_, title, meta, content) {
    var str_ = `<div id="${id_}" class="row note-preview" onclick="loadNote( \'${id_}\' );">`;
    console.log(str_);
    str_ = str_ + '<div class="intro-line">';
    console.log(str_);
    str_ = str_ + '<h4>'+title+'</h4>';
    console.log(str_);
    str_ = str_ + '<p> - |' + meta+ '|' +content +'|</p>';
    console.log(str_);
    str_ = str_ + '</div></div>';
    console.log(str_);
    return str_;
  };

  $cope.updateListView = function() {
    console.log("updating note-selector view");
    console.log($cope.notes);
    var accum = "";
    var str_ = "";
    for (var i = 0; i < $cope.notes.length; i++) {
      var note1 = $cope.notes[i];
      if (note1 !== undefined) {
        str_ = $cope.buildNotePreviewToHtml( // jshint ignore:line
          note1._id, note1.title, $cope.metaToTags(note1.meta), note1.content
          );
        accum = accum + str_;
      }
    }
    console.log("done updating selector view");
    document.getElementById("notes-list").innerHTML = accum;
  };

  $cope.sortNotesByAttr = function(attr) {
    $cope.sortBy = attr;
    if (attr === "title" || attr === "content") {
      $cope.notes = $cope.notes.sort(function(a, b) {
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
      $cope.notes = $cope.notes.sort(function(a, b) {
        if (a.meta[0] > b.meta[0]) {
          return 1;
        } else if (a.meta[0] === b.meta[0]) {
          return 0;
        } else {
          return -1;
        }
      });
    }
    $cope.updateListView();
  };

  $cope.syncNotes = function() {

    var data = { 
      "action": "update", 
      "notes": $cope.notes
    };
    var myJson = JSON.stringify(data);

    console.log("sync push");

    $cope.request("POST", "json", "/n.json", function(res) {
      console.log('sync push request');
      console.log(res);
      if (res.readyState === 4 && res.status === 200) {
        var response = JSON.parse( res.responseText );
        if (response.response !== "success") {
          console.log("sync push error");
        }
      }
    }, myJson);

    console.log("sync pull");

    var control = {
      "action": "readmany",
      "sort_by": $cope.sortBy,
      "page": 0,
      "count": 100
    };

    var controlJson = JSON.stringify(control);

    $cope.request("POST", "json", "/n.json", function(res) {
      console.log('sync pull request');
      console.log(res);
      if (res.readyState === 4 && res.status === 200) {
        var notesFromJSON = JSON.parse( res.responseText );
        if ($cope.notes === undefined) {
          $cope.notes = [];
        }
        console.log('notes? from json');
        $cope.notes = notesFromJSON;
        console.log(notesFromJSON);
        if ($cope.sortBy !== undefined) {
          $cope.sortNotesByAttr($cope.sortBy);
        }
        $cope.updateListView();
      }
    }, controlJson);
    console.log('end sync');
  };

  $cope.stringToMeta = function(req) {
    var res = req.split(", ");
    var meter = [];
    for (var i = 0; i < res.length; i++) {
      if (res[i] !== "") {
        meter.push(res[i]);
      }
    }
    $cope.meta.tags = meter;
    return $cope.meta;
  };

  $cope.saveAllEdits = function() {
    var title = document.getElementById("note-title").innerHTML;
    var metaStr = document.getElementById("note-meta").innerHTML;
    var meta = $cope.stringToMeta(metaStr);
    var count = document.getElementById("note-content").innerHTML;

    $cope.postNoteJSON($cope.id_, title, meta, count);
    $cope.updateListItem($cope.id_, title, meta, count);
    $cope.displaySaved();
    $cope.syncNotes();
  };

  $cope.createNewNote = function() {
    var data = { 
      "atoken": [
      $cope.username,
      $cope.token,
      ],
      "action": "create",
      "notes": [
      {
        "username": $cope.username,
      }
      ],
    };
    var myJson = JSON.stringify(data);
    
    $cope.request("POST", "json", "/n.json", function(res) {
      if (res.readyState === 4 && res.status === 200) {
        var fromJSON = JSON.parse( res.responseText )[0];
        $cope.id_ = fromJSON._id;
        document.getElementById("note-title").innerHTML = fromJSON.title;
        document.getElementById("note-meta").innerHTML = fromJSON.meta;
        document.getElementById("note-content").innerHTML = fromJSON.content;
        console.log("returned values were set");
      }
    }, myJson);

    $cope.syncNotes();
  };

  $cope.loadNote = function(newId) {
    $cope.syncNotes();
    if ($cope.sortBy !== undefined) {
      $cope.sortNotesByAttr($cope.sortBy);
    }
    if ($cope.notes !== undefined) {
      for (var i = $cope.notes.length - 1; i >= 0; i--) {
        var noteCandidate = $cope.notes[i];
        if (noteCandidate._id === newId) {
          $cope.id_ = newId;
          $cope.title = noteCandidate.title;
          $cope.meta = noteCandidate.meta;
          $cope.content = noteCandidate.content;
          console.log("returned values were set from local values");
          $cope.refreshView();
          return;
        }
      }
    }

    var data = { "action":"readone", "_id": newId };
    var myJson = JSON.stringify(data);

    $cope.request("POST", "json", "/n.json", function(res) {
      if (res.readyState === 4 && res.status === 200) {
        var fromJSON = JSON.parse( res.responseText );
        $cope.id_ = fromJSON._id;
        $cope.title = fromJSON.title;
        $cope.meta = fromJSON.meta;
        $cope.content = fromJSON.content;
        $cope.refreshView();
        console.log("returned values were set");
      }
    }, myJson);
  };
}

__notes($cope);