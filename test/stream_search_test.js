var assert = require('assert')

var streamSearchTests = {}

streamSearchTests.streamMatchAll = function streamMatchAll(streamingClient, done) {
	var tweet = {
		"user": "olivere",
		"message": "Welcome to Golang and Elasticsearch."
	}
	streamingClient.index({
		type: 'tweet',
		id: '1',
		body: tweet
	}).on('data', function(res) {
		var first = true
		var responseStream = streamingClient.searchStream({
			type: 'tweet',
			body: {
				query: {
					match_all: {}
				}
			}
		})
		responseStream.on('error', function(err) {
			if (err) {
				done(err)
				return
			}
		})
		responseStream.on('data', function(res) {
			if (first) {
				setTimeout(function() {
					streamingClient.index({
						type: 'tweet',
						id: '1',
						body: tweet
					}).on('error', function(err) {
						if (err) {
							done(err)
							return
						}
					})
				}, 2000)
				first = false
			} else {
				try {
					assert.deepEqual(res, {
						_type: 'tweet',
						_id: '1',
						_source: tweet
					}, 'event not as expected')
				} catch (e) {
					responseStream.stop()
					return done(e)
				}

				responseStream.stop()
				done()
			}
		})

		streamingClient.index({
			type: 'tweet',
			id: '1',
			body: tweet
		}).on('error', function(err) {
			if (err) {
				done(err)
				return
			}
		})
	}).on('error', function(err) {
		if (err) {
			done(err)
			return
		}
	})
}

module.exports = streamSearchTests