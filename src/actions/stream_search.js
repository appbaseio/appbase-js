var helpers = require('../helpers')

var streamSearchService = function streamSearchService(client, args) {
	var valid = helpers.validate(args, {
		'body': 'object'
	})
	if(valid !== true) {
		throw valid
		return
	}

	if(args.type === undefined || !(typeof args.type === 'string' || args.type.constructor === Array)
		|| (args.type === '' || args.type.length === 0) ) {
		throw new Error("fields missing: type")
		return
	}

	var type
	if(args.type.constructor === Array) {
		type = args.type.join()
	} else {
		type = args.type
	}

	var type = args.type
	var body = args.body
	delete args.type
	delete args.body
	delete args.stream

	args.streamonly = 'true'

	/* if Streams, add required parameters */
	if (!helpers.isAppbase(client)) {
		args.stream = true
		args.channel_id = client.channel_id
	}

	if (helpers.isAppbase(client)) {
		return client.performWsRequest({
			method: 'POST',
			path: type + '/_search',
			params: args,
			body: body
		})
	} else {
		/* first, subscribe to query */
		client.performStreamingRequest({
			method: 'POST',
			path: type + '/' + '_search',
			params: args,
			body: body
		})
		/* return stream object */
		return client.performWsRequest({})
	}
}

module.exports = streamSearchService
