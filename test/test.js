var elasticsearch = require('elasticsearch')
var appbase = require('../')

var indexTest = require('./index_test.js')
var streamDocumentTests = require('./stream_document_test.js')
var streamSearchTests = require('./stream_search_test.js')

describe('Appbase', function() {
	this.timeout(5000)

	var client, streamingClient

	before(function() {
		client = new elasticsearch.Client({
			host: 'http://testuser:testpass@localhost:7999',
			apiVersion: '1.6'
		});

		streamingClient = new appbase({
			url: 'http://localhost:7999',
			username: 'testuser',
			password: 'testpass',
			appname: 'testindex'
		})
	})

	describe('#index', function() {
		it('should index one document', function(done) {
			indexTest.indexOneDocument(streamingClient, done)
		})
	})

	describe('#streamDocument()', function () {
		it('should receive event when new document is inserted', function(done) {
			streamDocumentTests.streamOneDocument(client, streamingClient, done)
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
})