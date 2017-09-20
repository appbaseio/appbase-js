"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _helpers = require("../helpers");

var updateService = function updateService(client, args) {
	var valid = (0, _helpers.validate)(args, {
		"type": "string",
		"id": "string",
		"body": "object"
	});
	if (valid !== true) {
		throw valid;
		return;
	}

	var type = args.type,
	    id = args.id,
	    body = args.body;


	delete args.type;
	delete args.id;
	delete args.body;

	var path = type + "/" + id + "/_update";

	return client.performFetchRequest({
		method: "POST",
		path: path,
		params: args,
		body: body
	});
};

exports.default = updateService;
module.exports = exports["default"];