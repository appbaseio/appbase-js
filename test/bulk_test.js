var assert = require('assert')

var bulkTests = {}

bulkTests.bulkIndexOneDocument = function bulkIndexOneDocument(streamingClient, done) {
	var tweet = {"user": "olivere", "message": "Welcome to Golang and Elasticsearch."}
	streamingClient.bulk({
		body: [{
			index: {
				'_type': 'tweet',
				'_id': '2'
			}
		}, tweet]
	})
	.on('error', done)
	.on('data', function(res) {
		var first = true
		var responseStream = streamingClient.getStream({
			type: 'tweet',
			id: '2'
		})
		responseStream.on('error', function(err) {
			if(err) {
				done(err)
				return
			}
		})
		responseStream.on('data', function(res) {
			if(first) {
				delete res._version
				delete res._index
				try {
					assert.deepEqual(res, {
						_type: 'tweet',
						_id: '2',
						found: true,
						_source: tweet
					}, 'document not as expected')
				} catch(e) {
					responseStream.stop()
					return done(e)
				}
				streamingClient.delete({
					type: 'tweet',
					id: '2'
				}).on('error', done)
				first = false
			} else {
				try {
					assert.deepEqual(res, {
						_type: 'tweet',
						_id: '2',
						_source: tweet,
						_deleted: true
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

module.exports = bulkTests