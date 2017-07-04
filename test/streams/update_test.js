var assert = require('assert')

var updateTests = {}

updateTests.updateOneDocument = function updateOneDocument(streamingClient, done) {
	var tweet = {
		"user": "olivere",
		"message": "Welcome to Golang and Elasticsearch."
	}
	var tweet2 = {
		"user": "olivere",
		"message": "This is a new tweet."
	}
	streamingClient.index({
			type: 'tweet',
			id: '1',
			body: tweet
		})
		.on('error', done)
		.on('data', function(res) {
			var responseStream = streamingClient.getStream({
				type: 'tweet',
				id: '1'
			})
			responseStream.on('error', function(err) {
				if (err) {
					done(err)
					return
				}
			})
			responseStream.on('data', function(res) {
				try {
					assert.deepEqual(res, {
						_type: 'tweet',
						_id: '1',
						_source: tweet2,
						_updated: true
					}, 'event not as expected')
				} catch (e) {
					responseStream.stop()
					return done(e)
				}

				responseStream.stop()
				done()
			})

			setTimeout(function() {
				streamingClient.update({
					type: 'tweet',
					id: '1',
					body: {
						doc: tweet2
					}
				}).on('error', done)
			}, 2000)
		})
}

module.exports = updateTests