import { validate, isAppbase } from "../helpers";

const streamSearchService = function streamSearchService(client, args) {
	const valid = validate(args, {
		"body": "object"
	});
	if (valid !== true) {
		throw valid;
		return;
	}

	if (args.type === undefined || !(typeof args.type === "string" || Array.isArray(args.type))
		|| (args.type === "" || args.type.length === 0) ) {
		throw new Error("fields missing: type");
		return;
	}

	let type;
	if (Array.isArray(args.type)) {
		type = args.type.join();
	} else {
		type = args.type;
	}

	const { body } = args;

	delete args.type;
	delete args.body;
	delete args.stream;

	args.streamonly = "true";

	/* if Streams, add required parameters */
	if (!isAppbase(client)) {
		console.log("setting args for non-appbase streaming source");
		args.stream = true;
		args.channel_id = client.channel_id;
	}

	if (isAppbase(client)) {
		console.log("simple ws request with body");
		return client.performWsRequest({
			method: "POST",
			path: `${type}/_search`,
			params: args,
			body
		});
	} else {
		console.log("fetch + ws request");
		/* first, subscribe to document */
		client.performStreamingRequest({
			method: "POST",
			path: `${type}/_search`,
			params: args,
			body
		});

		/* return stream object */
		return client.performWsRequest({});
	}
};

export default streamSearchService;
