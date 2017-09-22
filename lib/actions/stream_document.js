"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _helpers = require("../helpers");

var streamDocumentService = function streamDocumentService(client, args) {
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
	delete args.stream;

	if (args.stream === true || args.stream === "true") {
		args.stream = "true";
	} else {
		delete args.stream;
		args.streamonly = "true";
	}

	/* if Streams, add required parameters */
	if (!(0, _helpers.isAppbase)(client)) {
		console.log("setting args for non-appbase streaming source");
		args.stream = true;
		args.channel_id = client.channel_id;
	}

	if ((0, _helpers.isAppbase)(client)) {
		console.log("simple ws request");
		return client.performWsRequest({
			method: "GET",
			path: type + "/" + id,
			params: args
		});
	} else {
		console.log("fetch + ws request");
		/* first, subscribe to document */
		client.performFetchRequest({
			method: "GET",
			path: type + "/" + id,
			params: args
		});

		/* return stream object */
		return client.performWsRequest({});
	}
};

exports.default = streamDocumentService;
module.exports = exports["default"];