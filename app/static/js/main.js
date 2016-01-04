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