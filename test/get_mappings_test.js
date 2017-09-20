var assert = require("assert");

var getMappingsTests = {};

getMappingsTests.getAllMappings = function getAllMappings(streamingClient, done) {
	streamingClient.getMappings()
		.on("error", done)
		.on("data", function(mappings) {

			if (mappings[streamingClient.appname].mappings) {
				done();
			} else {
				done(new Error("Mappings are not present"));
			}
		});
};

module.exports = getMappingsTests;