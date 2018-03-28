import { validate } from "../helpers";

export default function streamSearchService(client, args) {
	const valid = validate(args, {
		"body": "object"
	});
	if (valid !== true) {
		throw valid;
		return;
	}

	if (args.type === undefined || (Array.isArray(args.type) && args.type.length === 0)) {
		throw new Error("Missing fields: type");
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

	return client.performWsRequest({
		method: "POST",
		path: `${type}/_search`,
		params: args,
		body
	});
};
