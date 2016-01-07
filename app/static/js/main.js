"use strict";

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

function clone(obj) {
	var copy;
	if (null == obj || "object" != typeof obj) {
		return obj;
	}
	if (obj instanceof Array) {
		copy = [];
		var len = obj.length;
		for (var i = 0; i < len; i++) {
			copy[i] = clone(obj[i]);
		}
		return copy;
	}
	if (obj instanceof Object) {
		copy = {};
		for (var attr in obj) {
			if (obj.hasOwnProperty(attr)) {
				copy[attr] = clone(obj[attr]);
			}
		}
		return copy;
	}
	throw new Error("Unable to copy obj! Its type isn't supported");
}

var $cope = {};