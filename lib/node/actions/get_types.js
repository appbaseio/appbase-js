"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _through = require("through2");

var _through2 = _interopRequireDefault(_through);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getTypesService = function getTypesService(client) {
	var resultStream = _through2.default.obj(function (chunk, enc, callback) {
		var appname = Object.keys(chunk)[0];
		var types = Object.keys(chunk[appname]["mappings"]).filter(function (type) {
			return type !== "_default_";
		});
		this.push(types);

		callback();
	});
	resultStream.writable = false;

	return client.performStreamingRequest({
		method: "GET",
		path: "_mapping"
	}).pipe(resultStream);
};

exports.default = getTypesService;