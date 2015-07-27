var assert = require('assert')
var elasticsearch = require('elasticsearch')
var appbase = require('../appbase.js')

describe('Appbase', function() {
	this.timeout(5000)

	var client, streamingClient

	before(function() {
		client = new elasticsearch.Client({
			host: 'http://testuser:testpass@localhost:7999',
			apiVersion: '1.6'
		});

		streamingClient = appbase.newClient({
			url: 'http://localhost:7999',
			username: 'testuser',
			password: 'testpass',
			appname: 'testindex'
		})
	})

	describe('#streamDocument()', function () {
		it('should receive event when new document is inserted', function(done) {
			var tweet = {"user": "olivere", "message": "Welcome to Golang and Elasticsearch."}
			client.index({
				index: 'testindex',
				type: 'tweet',
				id: '1',
				body: tweet
			}, function(err, res) {
				if(err) {
					done(err)
					return
				}

				var first = true
				streamingClient.streamDocument({
					type: 'tweet',
					id: '1'
				}).on('error', function(err) {
					if(err) {
						done(err)
						return
					}
				}).on('data', function(res) {
					if(first) {
						client.index({
							index: 'testindex',
							type: 'tweet',
							id: '1',
							body: tweet
						}, function(err, res) {
							if(err) {
								done(err)
								return
							}
						})
						first = false
					} else {
						assert.deepEqual(res, {
							_index: 'testindex',
					        _type: 'tweet',
					        _id: '1',
					        _source: tweet
						}, 'event not as expected')

						done()
					}
				})
			})
		});
	});
});