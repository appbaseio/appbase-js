var assert = require('assert')

var indexTests = {}

indexTests.indexOneDocument = function indexOneDocument(streamingClient, done) {
	var tweet = {"user": "olivere", "message": "Welcome to Golang and Elasticsearch."}
	streamingClient.index({
		type: 'tweet',
		id: '1',
		body: tweet
	})
	.on('error', done)
	.on('data', function(res) {
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
				streamingClient.index({
					type: 'tweet',
					id: '1',
					body: tweet
				}).on('error', done)
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

module.exports = indexTests