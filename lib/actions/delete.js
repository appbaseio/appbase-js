"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = deleteService;

var _helpers = require("../helpers");

function deleteService(client, args) {
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

	var path = type + "/" + id;

	return client.performFetchRequest({
		method: "DELETE",
		path: path,
		params: args
	});
};
module.exports = exports["default"];