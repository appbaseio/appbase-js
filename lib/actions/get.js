"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _helpers = require("../helpers");

var getService = function getService(client, args) {
	var valid = (0, _helpers.validate)(args, {
		"type": "string",
		"id": "string"
	});

	if (valid !== true) {
		throw valid;
		return;
	}
	var type = args.type;
	var id = args.id;
	delete args.type;
	delete args.id;

	var path = type + "/" + id;

	return client.performFetchRequest({
		method: "GET",
		path: path,
		params: args
	});
};

exports.default = getService;
module.exports = exports["default"];