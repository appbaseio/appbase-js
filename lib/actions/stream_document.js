"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = streamDocumentService;

var _helpers = require("../helpers");

function streamDocumentService(client, args) {
	var valid = (0, _helpers.validate)(args, {
		"type": "string",
		"id": "string"
	});
	if (valid !== true) {
		throw valid;
		return;
	}

	var type = args.type,
	    id = args.id;


	delete args.type;
	delete args.id;
	delete args.stream;

	if (args.stream === true || args.stream === "true") {
		args.stream = "true";
	} else {
		delete args.stream;
		args.streamonly = "true";
	}

	return client.performWsRequest({
		method: "GET",
		path: type + "/" + id,
		params: args
	});
};
module.exports = exports["default"];