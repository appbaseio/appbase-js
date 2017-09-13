"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _helpers = require("../../helpers");

var _helpers2 = _interopRequireDefault(_helpers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var updateService = function updateService(client, args) {
	var valid = (0, _helpers2.default)(args, {
		"type": "string",
		"id": "string",
		"body": "object"
	});
	if (valid !== true) {
		throw valid;
		return;
	}
	var type = args.type;
	var id = args.id;
	var body = args.body;
	delete args.type;
	delete args.id;
	delete args.body;

	var path = type + "/" + id + "/_update";

	return client.performStreamingRequest({
		method: "POST",
		path: path,
		params: args,
		body: body
	});
};

exports.default = updateService;