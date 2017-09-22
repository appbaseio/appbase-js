import { validate, isAppbase } from "../helpers";

const streamDocumentService = function streamDocumentService(client, args) {
	const valid = validate(args, {
		"type": "string",
		"id": "string"
	});
	if (valid !== true) {
		throw valid;
		return;
	}

	const { type, id } = args;

	delete args.type;
	delete args.id;
	delete args.stream;

	if (args.stream === true || args.stream === "true") {
		args.stream = "true";
	} else {
		delete args.stream;
		args.streamonly = "true";
	}

	/* if Streams, add required parameters */
	if (!isAppbase(client)) {
		console.log("setting args for non-appbase streaming source");
		args.stream = true;
		args.channel_id = client.channel_id;
	}

	if (isAppbase(client)) {
		console.log("simple ws request");
		return client.performWsRequest({
			method: "GET",
			path: `${type}/${id}`,
			params: args
		});
	} else {
		console.log("fetch + ws request");
		/* first, subscribe to document */
		client.performFetchRequest({
			method: "GET",
			path: `${type}/${id}`,
			params: args
		});

		/* return stream object */
		return client.performWsRequest({});
	}
};


export default streamDocumentService;
