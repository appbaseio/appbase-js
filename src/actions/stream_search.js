import { validate } from "../helpers";

const streamSearchService = function streamSearchService(client, args) {
	const valid = validate(args, {
		"body": "object"
	});
	if(valid !== true) {
		throw valid
		return
	}

	if(args.type === undefined || !(typeof args.type === "string" || Array.isArray(args.type))
		|| (args.type === "" || args.type.length === 0) ) {
		throw new Error("fields missing: type")
		return
	}

	var type
	if(Array.isArray(args.type)) {
		type = args.type.join()
	} else {
		type = args.type
	}

	var type = args.type
	const body = args.body;
	delete args.type
	delete args.body
	delete args.stream

	args.streamonly = "true"

	return client.performWsRequest({
		method: "POST",
		path: `${type}/_search`,
		params: args,
		body
	})
};

export default streamSearchService;
