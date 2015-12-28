var notes = [];

function saveAllEdits() {
	var ttl = document.getElementById("note-title").innerHTML;
	var mta_str = document.getElementById("note-meta").innerHTML;
	var mta = string_to_meta(mta_str);
	console.log(mta);
	console.log(mta);
	var cnt = document.getElementById("note-content").innerHTML;

	postNoteJSON(id_, ttl, mta, cnt);
	updateListItem(id_, ttl, mta, cnt);
	displaySaved();
	syncNotes();
}

function postNoteJSON(id_, title, meta, content) {
	console.log('Saving note: '+id_+'\nTitle: '+title+'\nMeta: '+meta+'');

	var myData = {
		"title" : title,
		"meta" : meta,
		"content" : content
	};
	var myJson = JSON.stringify(myData);
	

	request("POST", 'json', '/n.json', function(xmlhttp) {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			var from_json = JSON.parse( xmlhttp.responseText );
			console.log(from_json);
			id_ = from_json._id;
			document.getElementById("note-title").innerHTML = from_json.title;
			document.getElementById("note-meta").innerHTML = from_json.meta;
			document.getElementById("note-content").innerHTML = from_json.content;
			console.log('returned values were set');
		}
	}, myJson);
}

function updateListItem(id_, title, meta, content) {
	for (var i = window.notes.length - 1; i >= 0; i--) {
		if (window.notes[i]._id === id_) {
			
			window.notes[i].title = title;
			window.notes[i].meta = meta;
			window.notes[i].content = content;
			
			console.log('note data pushed into the local list');
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

function syncNotes() {
	console.log('sync notes');

	request("GET", 'json', '/n.json', function(xmlhttp) {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			var notes_from_json = JSON.parse( xmlhttp.responseText );
			if (window.notes === undefined) {
				window.notes = [];
			}
			notes = notes_from_json;
			if (window.sort_by !== undefined) {
				sortNotesByAttr(sort_by);
			}
			console.log(notes);
			updateListView();
		}
	}, '');
}

function updateListView() {
	console.log('updating note-selector view');
	var accum = '';
	var str_ = '';
	for (var i = 0; i < notes.length; i++) {
		note1 = notes[i];
		str_ = build_note_preview_to_html(note1._id, note1.title, note1.meta, note1.content);
		accum = accum + str_;
	}
	document.getElementById("notes-list").innerHTML = accum;
}

function sortNotesByAttr(attr) {
	window.sort_by = attr;
	if (attr === 'title' || attr === 'content') {
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
	if (attr === 'meta') {
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

function createNewNote() {
	syncNotes();
	
	var url = '/n.json';
	var data = { 'action': 'create' };
	var myJson = JSON.stringify(data);
	
	request("POST", 'json', '/n.json', function(xmlhttp) {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			var from_json = JSON.parse( xmlhttp.responseText );
			console.log(from_json);
			id_ = from_json._id;
			document.getElementById("note-title").innerHTML = from_json.title;
			document.getElementById("note-meta").innerHTML = from_json.meta;
			document.getElementById("note-content").innerHTML = from_json.content;
			console.log('returned values were set');
		}
	}, myJson);

	syncNotes();
}

function loadNote(new_id) {
	syncNotes();
	if (window.sort_by !== undefined) {
		sortNotesByAttr(sort_by);
	}
	if (window.notes !== undefined) {
		for (var i = window.notes.length - 1; i >= 0; i--) {
			note_candidate = window.notes[i];
			if (note_candidate._id === new_id) {
				id_ = new_id;
				title = note_candidate.title;
				meta = note_candidate.meta;
				content = note_candidate.content;
				console.log('returned values were set from local values');
				refreshView();
				return;
			}
		}
	}

	var data = { 'action':'readone', '_id': new_id };
	var myJson = JSON.stringify(data);

	request("POST", 'json', '/n.json', function(xmlhttp) {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			var from_json = JSON.parse( xmlhttp.responseText );
			console.log(from_json);
			id_ = from_json._id;
			title = from_json.title;
			meta = from_json.meta;
			content = from_json.content;
			refreshView();
			console.log('returned values were set');
		}
	}, myJson);
}

function refreshView() {
	if (window.title !== undefined) {
		document.getElementById("note-title").innerHTML = title;
	}
	if (window.meta !== undefined) {
		document.getElementById("note-meta").innerHTML = meta_to_string(meta);
	}
	if (window.content !== undefined) {
		document.getElementById("note-content").innerHTML = content;
	}
	console.log('view updated');
}

function build_note_preview_to_html(id_, title, meta, content) {
	var str_ = '<div id="'+id_+'" class="row note-preview" onclick="loadNote( \''+ id_ + '\' );">';
	str_ = str_ + '<div class="intro-line">';
	str_ = str_ + '<h4>'+title+'</h4>';
	str_ = str_ + '<p> - |' + meta+ '|' +content +'|</p>';
	str_ = str_ + '</div></div>';
	return str_;
}

function string_to_meta(req) {
	var res = req.split(", ");
	console.log(res[res.length-1]);
	var meter = [];
	for (var i = 0; i < res.length; i++) {
		if (res[i] !== '') {
			meter.push(res[i]);
		}
	};
	return meter;
}

function meta_to_string(req) {
	var res = '';
	for (var i = 0; i < req.length; i++) {
		res = res+req[i] + ', ';
	};
	return res;
}

function request(request, type, url, action, send) {
	var xmlhttp = new XMLHttpRequest();
	
	xmlhttp.open(request, url, true);
	if (type === 'json') {
		xmlhttp.setRequestHeader('Content-Type', 'application/json');
	}

	xmlhttp.onreadystatechange = function () {
		action(xmlhttp);
	}

	xmlhttp.send(send);
}