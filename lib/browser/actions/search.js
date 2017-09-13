"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _helpers = require("../../helpers");

var _helpers2 = _interopRequireDefault(_helpers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var searchService = function searchService(client, args) {
	var valid = (0, _helpers2.default)(args, {
		"body": "object"
	});
	if (valid !== true) {
		throw valid;
		return;
	}

	var type = void 0;
	if (args.type.constructor === Array) {
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
		path = "/_search";
	}

	return client.performFetchRequest({
		method: "POST",
		path: path,
		params: args,
		body: body
	});
};

exports.default = searchService;