var assert = require('assert')

var streamDocumentTests = {}

streamDocumentTests.streamOneDocument = function streamOneDocument(client, streamingClient, done) {
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
		var responseStream = streamingClient.streamDocument({
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
			        _type: 'tweet',
			        _id: '1',
			        _source: tweet
				}, 'event not as expected')

				responseStream.pause()

				done()
			}
		})
	})
}

module.exports = streamDocumentTests