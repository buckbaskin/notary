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