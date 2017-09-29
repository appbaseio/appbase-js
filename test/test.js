var appbase = require("../lib");

var indexTest = require("./index_test.js");
var updateTest = require("./update_test.js");
var getTest = require("./get_test.js");
var searchTest = require("./search_test.js");
var bulkTest = require("./bulk_test.js");
var getStreamTests = require("./get_stream_test.js");
var searchStreamTests = require("./search_stream_test.js");
var getTypesTest = require("./get_types_test.js");
var getMappingsTest = require("./get_mappings_test.js");
var multipleInstancesTest = require("./multiple_instances_test.js");
var helper = require("../lib/helpers");
describe("Appbase", function() {
	this.timeout(10000);

	var client, streamingClient;

	before(function() {
		streamingClient = new appbase({
			url: "https://scalr.api.appbase.io",
			app: "appbasejs-test-app",
			credentials: "zuGt16TPP:1ede0dc2-e727-476e-bc35-ee2956e750ef"
		});
	});

	describe("#index()", function() {
		it("should index one document", function(done) {
			indexTest.indexOneDocument(streamingClient, done);
		});
	});

	describe("#update()", function() {
		it("should update one document", function(done) {
			updateTest.updateOneDocument(streamingClient, done);
		});
	});

	describe("#get()", function() {
		it("should get one document", function(done) {
			getTest.getOneDoc(streamingClient, done);
		});
	});

	describe("#search()", function() {
		it("should return results", function(done) {
			searchTest.searchForOneDoc(streamingClient, done);
		});
	});

	describe("#bulk()", function() {
		it("should bulk index one document", function(done) {
			bulkTest.bulkIndexOneDocument(streamingClient, done);
		});
	});

	describe("#getStream()", function() {
		it("should receive event when new document is inserted", function(done) {
			getStreamTests.streamOneDocument(streamingClient, done);
		});
		it("should not receive initial data", function(done) {
			getStreamTests.onlyStreamOneDocument(streamingClient, done);
		});
		it("should receive only one event", function(done) {
			getStreamTests.stopStreamingDocument(streamingClient, done);
		});
	});

	describe("#searchStream()", function() {
		it("should receive event when new document is inserted", function(done) {
			searchStreamTests.streamMatchAllSingleType(streamingClient, done);
		});

		it("should receive event when new document is inserted while querying multiple types", function(done) {
			searchStreamTests.streamMatchAllMultipleTypes(streamingClient, done);
		});
	});

	describe("#getTypes()", function() {
		it("should receive an array of types", function(done) {
			getTypesTest.getAllTypes(streamingClient, done);
		});
	});

	describe("#getMappings()", function() {
		it("should get mappings object", function(done) {
			getMappingsTest.getAllMappings(streamingClient, done);
		});
	});

	describe("#Compare two appbase instances", function() {
		it("should create a new instance on every new instantiation", function(done) {
			var newClient = new appbase({
				url: "https://scalr.api.appbase.io",
				app: "testapp123",
				credentials: "HkcL06rjZ:a83f7cb3-6cbb-40ef-bfa9-9c490abec06c"
			});
			multipleInstancesTest.compareInstances(streamingClient, newClient, done);
		});
	});

	describe("#helpers", function() {
		it("validate() : should check for body and type", function(done) {
			var mock = {
				"body": {
					test: "test"
				},
				"type": "test"
			};

			var e = helper.validate(mock, {
				"body": "object",
				"type": "string"
			});
			if (e !== true) {
				done(e);
			} else {
				done();
			}
		});
	});
});
