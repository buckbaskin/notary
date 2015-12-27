var notes = [];

function saveAllEdits() {
	var ttl = document.getElementById("note-title").innerHTML;
	var mta = document.getElementById("note-meta").innerHTML;
	var cnt = document.getElementById("note-content").innerHTML;

	postNoteJSON(id_, ttl, mta, cnt);

	syncNotes();
}

function displaySaved() {
	document.getElementById("saved").innerHTML = " - Saved";
	setTimeout(function() {
		document.getElementById("saved").innerHTML = "";
	}, 1000);
}

// function saveTitle() {
// 	var editElem = document.getElementById("note-title");
// 	var userVersion = editElem.innerHTML;
// 	localStorage.userEdits = userVersion;
// 	displaySaved();
// }

// function saveMeta() {
// 	var editElem = document.getElementById("note-meta");
// 	var userVersion = editElem.innerHTML;
// 	localStorage.userEdits = userVersion;
// 	displaySaved();
// }

// function saveContent() {
// 	var editElem = document.getElementById("note-content");
// 	var userVersion = editElem.innerHTML;
// 	localStorage.userEdits = userVersion;
// 	displaySaved();
// }

function postNoteJSON(id_, title, meta, content) {
	console.log('Saving note: '+id_+'\nTitle: '+title+'\nMeta: '+meta+'');

	var xmlhttp = new XMLHttpRequest();
	var url = '/n/'+id_+'.json';

	// var json_out = '{'+'"title" : '+title+', "meta" : '+meta+', "content" : '+content+' }'
	var myData = {
		"title" : title,
		"meta" : meta,
		"content" : content
	};

	var myJson = JSON.stringify(myData);
	console.log(myJson);
	
	xmlhttp.open("POST", url, true);
	xmlhttp.setRequestHeader('Content-Type', 'application/json');

	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			var from_json = JSON.parse( xmlhttp.responseText );
			console.log(from_json);
			id_ = from_json._id;
			document.getElementById("note-title").innerHTML = from_json.title;
			document.getElementById("note-meta").innerHTML = from_json.meta;
			document.getElementById("note-content").innerHTML = from_json.content;
			console.log('returned values were set');
		}
	};

	console.log(url);
	xmlhttp.send(myJson);
}

function createNewNote() {
	syncNotes();
	
	var xmlhttp = new XMLHttpRequest();
	var url = '/notes';

	xmlhttp.open("POST", url, true);
	xmlhttp.setRequestHeader('Content-Type', 'application/json');

	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			var from_json = JSON.parse( xmlhttp.responseText );
			console.log(from_json);
			id_ = from_json._id;
			document.getElementById("note-title").innerHTML = from_json.title;
			document.getElementById("note-meta").innerHTML = from_json.meta;
			document.getElementById("note-content").innerHTML = from_json.content;
			console.log('returned values were set');
		}
	};

	console.log(url);
	xmlhttp.send('');

	syncNotes();
}

function loadNote(new_id) {
	syncNotes();
	if (window.notes !== undefined) {
		for (var i = window.notes.length - 1; i >= 0; i--) {
			note_candidate = window.notes[i];
			if (note_candidate._id === new_id) {
				id_ = new_id;
				document.getElementById("note-title").innerHTML = note_candidate.title;
				document.getElementById("note-meta").innerHTML = note_candidate.meta;
				document.getElementById("note-content").innerHTML = note_candidate.content;
				console.log('returned values were set from local values');
				return;
			}
		}
	}
	var xmlhttp = new XMLHttpRequest();
	var url = '/n/'+new_id+'.json';

	xmlhttp.open("GET", url, true);
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			var from_json = JSON.parse( xmlhttp.responseText );
			console.log(from_json);
			id_ = from_json._id;
			document.getElementById("note-title").innerHTML = from_json.title;
			document.getElementById("note-meta").innerHTML = from_json.meta;
			document.getElementById("note-content").innerHTML = from_json.content;
			console.log('returned values were set');
		}
	};

	console.log(url);
	xmlhttp.send();
}

function syncNotes() {
	console.log('sync notes');
	var xmlhttp = new XMLHttpRequest();
	var url = '/n.json';

	xmlhttp.open("GET", url, true);
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			var notes_from_json = JSON.parse( xmlhttp.responseText );
			if (window.notes === undefined) {
				window.notes = [];
			}
			notes = notes_from_json;
			console.log(notes);
			var accum = '';
			var note1 = notes_from_json[0];
			var str_ = build_note_preview_to_html(note1._id, note1.title, note1.meta, note1.content);
			// console.log(str_);
			for (var i = 0; i < notes_from_json.length; i++) {
				note1 = notes_from_json[i];
				str_ = build_note_preview_to_html(note1._id, note1.title, note1.meta, note1.content);
				accum = accum + str_;
			}
			document.getElementById("notes-list").innerHTML = accum;
		}
	};

	console.log(url);
	xmlhttp.send();
}

function build_note_preview_to_html(id_, title, meta, content) {
	var str_ = '<div id="'+id_+'" class="row note-preview" onclick="loadNote( \''+ id_ + '\' );">';
	str_ = str_ + '<div class="intro-line">';
	str_ = str_ + '<h4>'+title+'</h4>';
	str_ = str_ + '<p> - |' + meta+ '|' +content +'|</p>';
	str_ = str_ + '</div></div>';
	return str_;
}