"use strict";
/* globals -$scope */

var $scope = {};

$scope.username = "";
$scope.token = "";

$scope.request = function(request, type, url, action, send) {
  var xmlhttp = new XMLHttpRequest();
  
  xmlhttp.open(request, url, true);
  if (type === "json") {
    xmlhttp.setRequestHeader("Content-Type", "application/json");
  }

  xmlhttp.onreadystatechange = function () {
    action(xmlhttp);
  };

  xmlhttp.send(send);
};

$scope.clone = function(obj) {
  var copy;
  if (null == obj || "object" !== typeof obj) {
    return obj;
  }
  if (obj instanceof Array) {
    copy = [];
    var len = obj.length;
    for (var i = 0; i < len; i++) {
      copy[i] = $scope.clone(obj[i]);
    }
    return copy;
  }
  if (obj instanceof Object) {
    copy = {};
    for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) {
        copy[attr] = $scope.clone(obj[attr]);
      }
    }
    return copy;
  }
  throw new Error("Unable to copy obj! Its type isn't supported");
};

$scope.try_cookie = function () {
  try {
    var items = document.cookie.split(";");
    for (var i = 0; i < items.length; i++) {
      var c = items[i];
      while (c.charAt(0)==' ') {
        c = c.substring(1);
      }
      var spliter = c.indexOf('=');
      var property = c.substring(0,spliter);
      var value = c.substring(spliter+1, c.length);
      console.log('try cookie: ', property, ';;',value);
      if (property === 'atoken') {
        $scope.authToken = value;
      }
      if (property === 'username') {
        console.log('set username from cookie');
        $scope.username = value;
      }
    };
  } catch(err) {
    if (document.cookie === '') {
      console.log('no cookie set');
    } else {
      console.log(err);
      console.log('try_cookie failed');
    }
  }
};

$scope.try_cookie();