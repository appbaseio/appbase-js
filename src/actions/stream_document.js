var helpers = require('../helpers')

var streamDocumentService = function streamDocumentService(client, args) {
	var valid = helpers.validate(args, {
		'type': 'string',
		'id': 'string'
	})
	if(valid !== true) {
		throw valid
		return
	}
	var type = args.type
	var id = args.id
	delete args.type
	delete args.id
	delete args.stream

	if(args.stream === true || args.stream === 'true') {
		args.stream = 'true'
	} else {
		delete args.stream
		args.streamonly = 'true'
	}

	/* if Streams, add required parameters */
	if (!helpers.isAppbase(client)) {
		args.stream = true
		args.channel_id = client.channel_id
	}

	if (helpers.isAppbase(client)) {
		return client.performWsRequest({
			method: 'GET',
			path: type + '/' + id,
			params: args,
		})
	} else {
		/* first, subscribe to document */
		client.performStreamingRequest({
			method: "GET",
			path: type + '/' + id,
			params: args
		})
		/* return stream object */
		return client.performWsRequest({})
	}
}


module.exports = streamDocumentService
