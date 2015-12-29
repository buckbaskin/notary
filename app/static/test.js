"use strict";
/* jshint ignore:start */
function meta_to_string(req) {
	var res = '';
	for (var i = 0; i < req.length; i++) {
		res = res+req[i] + ', ';
	};
	return res;
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

var res = [];
res.push(1);
res.push('');
res.push(2);
res.push(3);

console.log(meta_to_string(res));
console.log(string_to_meta(meta_to_string(res)));
/* jshint ignore:end */