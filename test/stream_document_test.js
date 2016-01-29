var assert = require('assert')

var streamDocumentTests = {}

streamDocumentTests.streamOneDocument = function streamOneDocument(streamingClient, done) {
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

streamDocumentTests.onlyStreamOneDocument = function onlyStreamOneDocument(streamingClient, done) {
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
	}).on('error', function(err) {
		if (err) {
			done(err)
			return
		}
	})
}

streamDocumentTests.stopStreamingDocument = function stopStreamingDocument(streamingClient, done) {
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
				}, 1000);
				first = false
			} else {
				console.log("further events:", res)
				done(new Error('Received second event'))
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

module.exports = streamDocumentTests