var assert = require('assert')

var streamDocumentTests = {}

streamDocumentTests.streamOneDocument = function streamOneDocument(client, streamingClient, done) {
	var tweet = {"user": "olivere", "message": "Welcome to Golang and Elasticsearch."}
	client.index({
		index: 'createnewtestapp01',
		type: 'tweet',
		id: '1',
		body: tweet
	}, function(err, res) {
		if(err) {
			done(err)
			return
		}

		var first = true
		var responseStream = streamingClient.readStream({
			type: 'tweet',
			id: '1'
		})
		responseStream.on('error', function(err) {
			if(err) {
				done(err)
				return
			}
		})
		responseStream.on('data', function(res) {
			if(first) {
				client.index({
					index: 'createnewtestapp01',
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
				try {
					assert.deepEqual(res, {
						_type: 'tweet',
						_id: '1',
						_source: tweet
					}, 'event not as expected')
				} catch(e) {
					responseStream.stop()
					return done(e)
				}

				responseStream.stop()
				done()
			}
		})
	})
}

streamDocumentTests.onlyStreamOneDocument = function onlyStreamOneDocument(client, streamingClient, done) {
	var tweet = {"user": "olivere", "message": "Welcome to Golang and Elasticsearch."}
	client.index({
		index: 'createnewtestapp01',
		type: 'tweet',
		id: '1',
		body: tweet
	}, function(err, res) {
		if(err) {
			done(err)
			return
		}

		var first = true
		var responseStream = streamingClient.readStream({
			type: 'tweet',
			id: '1',
			streamonly: true
		})
		responseStream.on('error', function(err) {
			if(err) {
				done(err)
				return
			}
		})

		client.index({
			index: 'createnewtestapp01',
			type: 'tweet',
			id: '1',
			body: tweet
		}, function(err, res) {
			if(err) {
				done(err)
				return
			}
		})

		responseStream.on('data', function(res) {
			try {
				assert.deepEqual(res, {
					_type: 'tweet',
					_id: '1',
					_source: tweet
				}, 'event not as expected')
			} catch(e) {
				responseStream.stop()
				return done(e)
			}

			responseStream.stop()
			done()
		})
	})
}

streamDocumentTests.stopStreamingDocument = function stopStreamingDocument(client, streamingClient, done) {
	var tweet = {"user": "olivere", "message": "Welcome to Golang and Elasticsearch."}
	client.index({
		index: 'createnewtestapp01',
		type: 'tweet',
		id: '1',
		body: tweet
	}, function(err, res) {
		if(err) {
			done(err)
			return
		}

		var first = true
		var responseStream = streamingClient.readStream({
			type: 'tweet',
			id: '1'
		})
		responseStream.on('error', function(err) {
			if(err) {
				done(err)
				return
			}
		})
		responseStream.on('data', function(res) {
			if(first) {
				client.index({
					index: 'createnewtestapp01',
					type: 'tweet',
					id: '1',
					body: tweet
				}, function(err, res) {
					if(err) {
						done(err)
						return
					}
				})
				responseStream.stop()
				var waitForEvent = setTimeout(function () {
					done();
				}, 1000);
				first = false
			} else {
				console.log("further events:", res)
				done(new Error('Received second event'))
			}
		})
	})
}

module.exports = streamDocumentTests