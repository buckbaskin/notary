function saveAllEdits() {
	alert('saveAllEdits');
	saveTitle();
	saveMeta();
	saveContent();
}
function displaySaved() {
	document.getElementById("saved").innerHTML = " - Saved"
	setTimeout(function() {
		document.getElementById("saved").innerHTML = ""
	}, 1000);
}
// function autoSave() {
// 	alert('autoSave called');
// 	setInterval(saveAllEdits(), 5000);
// }
function saveTitle() {
	var editElem = document.getElementById("note-title");
	var userVersion = editElem.innerHTML;
	localStorage.userEdits = userVersion;
	displaySaved();
}
function saveMeta() {
	var editElem = document.getElementById("note-meta");
	var userVersion = editElem.innerHTML;
	localStorage.userEdits = userVersion;
	displaySaved();
}
function saveContent() {
	var editElem = document.getElementById("note-content");
	var userVersion = editElem.innerHTML;
	localStorage.userEdits = userVersion;
	displaySaved();
}