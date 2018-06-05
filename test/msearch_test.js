var searchTests = {};

searchTests.searchForDocs = function searchForDocs(streamingClient, done) {
	var tweet = { "user": "olivere", "message": "Welcome to Golang and Elasticsearch." };
	streamingClient.index({
		type: "tweet",
		id: "1",
		body: tweet
	})
		.on("error", function(e) {
			console.log(e);
			done(e);
		})
		.on("data", function(res) {
			// index second tweet
			var penguinTweet = { "user": "penguin", "message": "woot woot!" };
			streamingClient.index({
				type: "tweet",
				id: "2",
				body: penguinTweet
			})
				.on("error", function(e) {
					console.log(e);
					done(e);
				})
				.on("data", function(res) {
					var first = true;
					var responseStream = streamingClient.msearch({
						type: "tweet",
						body: [
							{},
							{ "query" : { "match_all" : {} } },
							{},
							{ "query" : { "match": { "_id": 1 } } }

						]
					});
					responseStream.on("error", function(err) {
						if(err) {
							done(err);
							return;
						}
					});
					responseStream.on("data", function(res) {
						if(res.responses.length === 2) {
							done();
						} else {
							done(new Error("_mstream has not returned the array of responses"));
						}
					});
				});
		});
};

module.exports = searchTests;
