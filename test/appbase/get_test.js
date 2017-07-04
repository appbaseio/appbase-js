var getTests = {}

getTests.getOneDoc = function getOneDoc(streamingClient, done) {
	var tweet = {"user": "olivere", "message": "Welcome to Golang and Elasticsearch."}
	streamingClient.index({
		type: 'tweet',
		id: '1',
		body: tweet
	})
	.on('error', done)
	.on('data', function(res) {
		var first = true
		var responseStream = streamingClient.get({
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
			if(res) {
				done()
			} else {
				done(new Error('Atleast 1 document should have been present.'))
			}
		})
	})
}

module.exports = getTests