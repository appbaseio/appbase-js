"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = getMappingsService;
function getMappingsService(client) {
	return client.performFetchRequest({
		method: "GET",
		path: "_mapping"
	});
};
module.exports = exports["default"];