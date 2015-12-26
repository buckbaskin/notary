function saveAllEdits() {
	var ttl = document.getElementById("note-title").innerHTML;
	var mta = document.getElementById("note-meta").innerHTML;
	var cnt = document.getElementById("note-content").innerHTML;

	postNoteJSON(id_, ttl, mta, cnt);
}

function displaySaved() {
	document.getElementById("saved").innerHTML = " - Saved"
	setTimeout(function() {
		document.getElementById("saved").innerHTML = ""
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
	console.log('Saving note: '+id_+
		'\nTitle: '+title+'\nMeta: '+meta+'');

	var xmlhttp = new XMLHttpRequest();
	var url = '/n/'+id_+'.json';

	// var json_out = '{'+'"title" : '+title+', "meta" : '+meta+', "content" : '+content+' }'
	var myData = {
		"title" : title,
		"meta" : meta,
		"content" : content
	}

	var myJson = JSON.stringify(myData);
	console.log(myJson);
	
	xmlhttp.open("POST", url, true);
	xmlhttp.setRequestHeader('Content-Type', 'application/json');

	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			var from_json = JSON.parse( xmlhttp.responseText );
			console.log(from_json)
			id_ = from_json["_id"];
			document.getElementById("note-title").innerHTML = from_json["title"];
			document.getElementById("note-meta").innerHTML = from_json["meta"];
			document.getElementById("note-content").innerHTML = from_json["content"];
			console.log('returned values were set');
		}
	}

	console.log(url)
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
			console.log(from_json)
			id_ = from_json["_id"];
			document.getElementById("note-title").innerHTML = from_json["title"];
			document.getElementById("note-meta").innerHTML = from_json["meta"];
			document.getElementById("note-content").innerHTML = from_json["content"];
			console.log('returned values were set');
		}
	}

	console.log(url)
	xmlhttp.send('');

	syncNotes();
}

function loadNote(new_id) {
	syncNotes();
	var xmlhttp = new XMLHttpRequest();
	var url = '/n/'+new_id+'.json';

	xmlhttp.open("GET", url, true);
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			var from_json = JSON.parse( xmlhttp.responseText );
			console.log(from_json)
			id_ = from_json["_id"]
			document.getElementById("note-title").innerHTML = from_json["title"];
			document.getElementById("note-meta").innerHTML = from_json["meta"];
			document.getElementById("note-content").innerHTML = from_json["content"];
			console.log('returned values were set');
		}
	}

	console.log(url)
	xmlhttp.send();
}

function syncNotes() {
	console.log('sync notes');
}