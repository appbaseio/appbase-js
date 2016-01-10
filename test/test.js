var elasticsearch = require('elasticsearch')
var appbase = require('../')

var indexTest = require('./index_test.js')
var getTest = require('./get_test.js')
var searchTest = require('./search_test.js')
var bulkTest = require('./bulk_test.js')
var streamDocumentTests = require('./stream_document_test.js')
var streamSearchTests = require('./stream_search_test.js')
var getTypesTest = require('./get_types_test.js')
var helpers = require("../src/helpers");
describe('Appbase', function() {
	this.timeout(10000)

	var client, streamingClient

	before(function() {
		client = new elasticsearch.Client({
			host: 'http://qQo5ks1e3:8ebad324-f93a-48ca-aca8-d57d2e71779c@scalr.api.appbase.io',
			apiVersion: '1.6'
		});

		streamingClient = new appbase({
			url: 'http://qQo5ks1e3:8ebad324-f93a-48ca-aca8-d57d2e71779c@scalr.api.appbase.io',
			appname: 'es2test1'
		})
	})

	describe('#index()', function() {
		it('should index one document', function(done) {
			indexTest.indexOneDocument(streamingClient, done)
		})
	})

	describe('#get()', function() {
		it('should get one document', function(done) {
			getTest.getOneDoc(streamingClient, done)
		})
	})

	describe('#search()', function() {
		it('should return results', function(done) {
			searchTest.searchForOneDoc(streamingClient, done)
		})
	})

	describe('#bulk()', function() {
		it('should bulk index one document', function(done) {
			bulkTest.bulkIndexOneDocument(streamingClient, done)
		})
	})

	describe('#streamDocument()', function () {
		it('should receive event when new document is inserted', function(done) {
			streamDocumentTests.streamOneDocument(client, streamingClient, done)
		})
		it('should not receive initial data', function(done) {
			streamDocumentTests.onlyStreamOneDocument(client, streamingClient, done)
		})
		it('should receive only one event', function(done) {
			streamDocumentTests.stopStreamingDocument(client, streamingClient, done)
		})
	})

	describe('#streamSearch()', function () {
		it('should receive event when new document is inserted', function(done) {
			streamSearchTests.streamMatchAll(client, streamingClient, done)
		})
	})

	describe('#getTypes()', function () {
		it('should receive an array of types', function(done) {
			getTypesTest.getAllTypes(streamingClient, done)
		})
	})

	describe('#helpers',function(){
		it('validate() : should check for body and type',function(done){
			var mock = {
			    'body': { test: 'test' },
			    'type': "test"
			}

			var e = helpers.validate(mock,{ 'body': 'object', 'type': 'string' })
			if(e !== true) {
				done(e)
			} else {
				done()
			}
		})
	})
})
