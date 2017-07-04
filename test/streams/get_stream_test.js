var assert = require('assert')

var getStreamTests = {}

getStreamTests.streamOneDocument = function streamOneDocument(streamingClient, done) {
	var tweet = {
		"user": "olivere",
		"message": "Welcome to Golang and Elasticsearch."
	}
	streamingClient.index({
		type: 'tweet',
		id: '1',
		body: tweet
	}).on('data', function(res) {
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
					_source: tweet
				}, 'event not as expected')
			} catch (e) {
				responseStream.stop()
				return done(e)
			}

			responseStream.stop()
			done()
		})

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
	}).on('error', function(err) {
		if (err) {
			done(err)
			return
		}
	})
}

getStreamTests.onlyStreamOneDocument = function onlyStreamOneDocument(streamingClient, done) {
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
		var responseStream = streamingClient.getStream({
			type: 'tweet',
			id: '1',
			streamonly: true
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
					_source: tweet
				}, 'event not as expected')
			} catch (e) {
				responseStream.stop()
				return done(e)
			}

			responseStream.stop()
			done()
		})

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
	}).on('error', function(err) {
		if (err) {
			done(err)
			return
		}
	})
}

getStreamTests.stopStreamingDocument = function stopStreamingDocument(streamingClient, done) {
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
			if (first) {
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

				responseStream.stop()
				var waitForEvent = setTimeout(function() {
					done();
				}, 2000);
				first = false
			} else {
				console.log("further events:", res)
				done(new Error('Received second event'))
			}
		})

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
	}).on('error', function(err) {
		if (err) {
			done(err)
			return
		}
	})
}

module.exports = getStreamTests