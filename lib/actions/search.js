"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = searchService;

var _helpers = require("../helpers");

function searchService(client, args) {
	var valid = (0, _helpers.validate)(args, {
		"body": "object"
	});
	if (valid !== true) {
		throw valid;
		return;
	}

	var type = void 0;
	if (Array.isArray(args.type)) {
		type = args.type.join();
	} else {
		type = args.type;
	}

	var body = args.body;


	delete args.type;
	delete args.body;

	var path = void 0;
	if (type) {
		path = type + "/_search";
	} else {
		path = "_search";
	}

	return client.performFetchRequest({
		method: "POST",
		path: path,
		params: args,
		body: body
	});
};
module.exports = exports["default"];