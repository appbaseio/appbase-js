var assert = require("assert");

var multipleInstancesTest = {};

multipleInstancesTest.compareInstances = function compareInstances(streamingClient, newClient, done) {
	if(!Object.is(streamingClient, newClient)) {
		done();
	} else {
		done(new Error("Both instances are identical"));
	}
};

module.exports = multipleInstancesTest;
