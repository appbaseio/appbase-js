"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _stream = require("stream");

var _stream2 = _interopRequireDefault(_stream);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getTypesService = function getTypesService(client) {
	var stream = new _stream2.default();

	client.performFetchRequest({
		method: "GET",
		path: "_mapping"
	}).on("data", function (data) {
		var types = Object.keys(data[client.appname]["mappings"]).filter(function (type) {
			return type !== "_default_";
		});
		stream.emit("data", types);
	}).on("error", function (error) {
		stream.emit("error", error);
	}).on("end", function () {
		stream.emit("end");
	});

	return stream;
};

exports.default = getTypesService;