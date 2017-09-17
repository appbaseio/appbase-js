"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
var getMappingsService = function getMappingsService(client) {
	return client.performFetchRequest({
		method: "GET",
		path: "_mapping"
	});
};

exports.default = getMappingsService;