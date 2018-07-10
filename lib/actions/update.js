"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = updateService;

var _helpers = require("../helpers");

function updateService(client, args) {
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

	var path = type + "/" + encodeURIComponent(id) + "/_update";

	return client.performFetchRequest({
		method: "POST",
		path: path,
		params: args,
		body: body
	});
};
module.exports = exports["default"];