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
	alert('Saving note: '+id_+
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
			alert('res: '+xmlhttp.responseText);
		}
	}

	console.log(url)
	xmlhttp.send(myJson);
}