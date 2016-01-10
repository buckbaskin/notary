"use strict";
/* globals $scope: true */

function __notes(oldScope) {
  $scope = oldScope.clone(oldScope);
  $scope.notes = [];
  $scope.sortBy = "title";
  $scope.title = "";
  $scope.meta = {
    "tags" : [],
    "created" : Date.now(),
    "updated" : Date.now(),
    "due_date" : undefined
  };
  $scope.content = "";
  if ($scope.id_ === undefined) {
    $scope.id_ = "567dff3599b4971e04354410";
  }
  $scope.token = "";
  $scope.username = "";

  $scope.metaToTags = function(meta) {
    var tags = meta.tags;
    return tags.join(", ");
  };

  $scope.metaToString = function(req) {
    // var createdStr = req.created;
    // var updatedStr = req.updated;
    // var dueDateStr = req.due_date; // jshint ignore:line
    var res = $scope.metaToTags(req);
    return res;
  };

  $scope.refreshView = function() {
    if ($scope.title !== undefined) {
      document.getElementById("note-title").innerHTML = $scope.title;
    }
    if ($scope.meta !== undefined) {
      document.getElementById("note-meta").innerHTML = $scope.metaToString($scope.meta);
    }
    if ($scope.content !== undefined) {
      document.getElementById("note-content").innerHTML = $scope.content;
    }
    console.log("view updated");
  };

  $scope.postNoteJSON = function(id_, title, meta, content, username) {
    var myNote = {
      "_id": id_,
      "title" : title,
      "meta" : meta,
      "content" : content,
      "username": username
    };
    var myData = {
      "atoken": [$scope.username, $scope.authToken],
      "action": "update", 
      "notes": [ myNote ]
    };
    var myJson = JSON.stringify(myData);
    
    $scope.request("POST", "json", "/n.json", function(res) {
      if (res.readyState === 4 && res.status === 200) {
        var fromJSON = JSON.parse( res.responseText );
        if (fromJSON.redirect !== undefined) {
          console.log('redirect...')
          window.location = fromJSON.redirect;
        }
        $scope.id_ = fromJSON._id;
        $scope.title = fromJSON.title;
        $scope.meta = fromJSON.meta;
        $scope.content = fromJSON.content;
        $scope.refreshView();
      }
    }, myJson);
  };

  $scope.updateListItem = function(id_, title, meta, content) {
    for (var i = $scope.notes.length - 1; i >= 0; i--) {
      if ($scope.notes[i]._id === id_) {

        $scope.notes[i].title = title;
        $scope.notes[i].meta = meta;
        $scope.notes[i].content = content;
        
        console.log("note data pushed into the local list");
        return;
      }
    }
  };

  $scope.displaySaved = function() {
    document.getElementById("saved").innerHTML = " - Saved";
    setTimeout(function() {
      document.getElementById("saved").innerHTML = "";
    }, 1000);
  };

  $scope.buildNotePreviewToHtml = function(id_, title, meta, content) {
    var str_ = `<div id="${id_}" class="row note-preview" onclick="$scope.loadNote( \'${id_}\' );">`;
    str_ = str_ + '<div class="intro-line">';
    str_ = str_ + '<h4>'+title+'</h4>';
    str_ = str_ + '<p> - |' + meta+ '|' +content +'|</p>';
    str_ = str_ + '</div></div>';
    return str_;
  };

  $scope.updateListView = function() {
    var accum = "";
    var str_ = "";
    for (var i = 0; i < $scope.notes.length; i++) {
      var note1 = $scope.notes[i];
      if (note1 !== undefined) {
        str_ = $scope.buildNotePreviewToHtml( // jshint ignore:line
          note1._id, note1.title, $scope.metaToTags(note1.meta), note1.content
          );
        accum = accum + str_;
      }
    }
    // console.log("done updating selector view");
    document.getElementById("notes-list").innerHTML = accum;
  };

  $scope.sortNotesByAttr = function(attr) {
    $scope.sortBy = attr;
    if (attr === "title" || attr === "content") {
      $scope.notes = $scope.notes.sort(function(a, b) {
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
      $scope.notes = $scope.notes.sort(function(a, b) {
        if (a.meta[0] > b.meta[0]) {
          return 1;
        } else if (a.meta[0] === b.meta[0]) {
          return 0;
        } else {
          return -1;
        }
      });
    }
    $scope.updateListView();
  };

  $scope.syncNotes = function() {
    console.log('syncing notes...');
    var data = {
      "atoken": [$scope.username, $scope.authToken],
      "action": "update", 
      "notes": $scope.notes,
    };
    var myJson = JSON.stringify(data);

    console.log("sync push");

    $scope.request("POST", "json", "/n.json", function(res) {
      if (res.readyState === 4 && res.status === 200) {
        var response = JSON.parse( res.responseText );
        if (response.redirect !== undefined) {
          console.log('redirect...')
          window.location = response.redirect;
        }
        if (response.response !== "success") {
          console.log("sync push error");
        }
      }
    }, myJson);

    var control = {
      "atoken": [$scope.username, $scope.authToken],
      "action": "readmany",
      "sort_by": $scope.sortBy,
      "page": 0,
      "count": 100,
    };

    var controlJson = JSON.stringify(control);

    $scope.request("POST", "json", "/n.json", function(res) {
      if (res.readyState === 4 && res.status === 200) {
        console.log('sync pull res ', res)
        var notesFromJSON = JSON.parse( res.responseText );
        if ($scope.notes === undefined) {
          $scope.notes = [];
        }
        if (notesFromJSON instanceof Array) {
          $scope.notes = notesFromJSON;
        } else {
          $scope.notes = [];
        }
        if ($scope.sortBy !== undefined) {
          $scope.sortNotesByAttr($scope.sortBy);
        }
        console.log("sync pull");
        $scope.updateListView();
      }
    }, controlJson);
    // console.log('end sync');
  };

  $scope.stringToMeta = function(req) {
    var res = req.split(", ");
    var meter = [];
    for (var i = 0; i < res.length; i++) {
      if (res[i] !== "") {
        meter.push(res[i]);
      }
    }
    $scope.meta.tags = meter;
    return $scope.meta;
  };

  $scope.saveAllEdits = function() {
    var title = document.getElementById("note-title").innerHTML;
    var metaStr = document.getElementById("note-meta").innerHTML;
    var meta = $scope.stringToMeta(metaStr);
    var count = document.getElementById("note-content").innerHTML;

    $scope.postNoteJSON($scope.id_, title, meta, count, $scope.username);
    $scope.updateListItem($scope.id_, title, meta, count);
    $scope.displaySaved();
    $scope.syncNotes();
  };

  $scope.createNewNote = function() {
    var data = { 
      "atoken": [$scope.username, $scope.authToken],
      "action": "create",
      "notes": [
      {
        "username": $scope.username,
      }
      ],
    };
    var myJson = JSON.stringify(data);
    
    $scope.request("POST", "json", "/n.json", function(res) {
      if (res.readyState === 4 && res.status === 200) {
        var fromJSON = JSON.parse( res.responseText )[0];
        $scope.id_ = fromJSON._id;
        document.getElementById("note-title").innerHTML = fromJSON.title;
        document.getElementById("note-meta").innerHTML = fromJSON.meta;
        document.getElementById("note-content").innerHTML = fromJSON.content;
        console.log("create returned values were set");
      }
    }, myJson);

    $scope.syncNotes();
  };

  $scope.copyLiveNote = function() {
    if ($scope.title.length > 0) {
      var data = { 
        "atoken": [$scope.username, $scope.authToken],
        "action": "create",
        "notes": [
        {
          "username": $scope.username,
          "title": $scope.title+" copy",
          "meta": $scope.meta,
          "content": $scope.content,
        }
        ],
      };
      var myJson = JSON.stringify(data);
      
      $scope.request("POST", "json", "/n.json", function(res) {
        if (res.readyState === 4 && res.status === 200) {
          $scope.syncNotes();
          console.log("copied note.");
        }
      }, myJson);
    } else {
      console.log('Please add a note title');
    }
  };

  $scope.loadNote = function(newId) {
    $scope.syncNotes();
    if ($scope.sortBy !== undefined) {
      $scope.sortNotesByAttr($scope.sortBy);
    }
    if ($scope.notes !== undefined) {
      for (var i = $scope.notes.length - 1; i >= 0; i--) {
        var noteCandidate = $scope.notes[i];
        if (noteCandidate._id === newId) {
          $scope.id_ = newId;
          $scope.title = noteCandidate.title;
          $scope.meta = noteCandidate.meta;
          $scope.content = noteCandidate.content;
          console.log("returned values were set from local values");
          $scope.refreshView();
          return;
        }
      }
    }

    var data = { 
      "atoken": [ $scope.username, $scope.authToken ],
      "action":"readone", 
      "_id": newId,
    };
    var myJson = JSON.stringify(data);

    $scope.request("POST", "json", "/n.json", function(res) {
      if (res.readyState === 4 && res.status === 200) {
        console.log('res', res);
        var fromJSON = JSON.parse( res.responseText );
        $scope.id_ = fromJSON._id;
        $scope.title = fromJSON.title;
        $scope.meta = fromJSON.meta;
        $scope.content = fromJSON.content;
        $scope.refreshView();
        console.log("returned values were set");
      }
    }, myJson);
  };

  $scope.try_cookie();
}

__notes($scope);