"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = indexService;

var _helpers = require("../helpers");

function indexService(client, args) {
	var valid = (0, _helpers.validate)(args, {
		"type": "string",
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

	var path = void 0;
	if (id) {
		path = type + "/" + id;
	} else {
		path = type;
	}

	return client.performFetchRequest({
		method: "POST",
		path: path,
		params: args,
		body: body
	});
};
module.exports = exports["default"];