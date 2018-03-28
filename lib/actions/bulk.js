"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = bulkService;

var _helpers = require("../helpers");

function bulkService(client, args) {
	var valid = (0, _helpers.validate)(args, {
		"body": "object"
	});
	if (valid !== true) {
		throw valid;
		return;
	}

	var type = args.type,
	    body = args.body;


	delete args.type;
	delete args.body;

	var path = void 0;
	if (type) {
		path = type + "/_bulk";
	} else {
		path = "/_bulk";
	}

	return client.performFetchRequest({
		method: "POST",
		path: path,
		params: args,
		body: body
	});
};
module.exports = exports["default"];