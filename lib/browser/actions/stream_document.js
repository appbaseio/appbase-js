"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _helpers = require("../../helpers");

var _helpers2 = _interopRequireDefault(_helpers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var streamDocumentService = function streamDocumentService(client, args) {
	var valid = (0, _helpers2.default)(args, {
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

exports.default = streamDocumentService;