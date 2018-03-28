import { validate } from "../helpers";

export default function msearchService(client, args) {
	const valid = validate(args, {
		"body": "object"
	});
	if (valid !== true) {
		throw valid;
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

	let path;
	if (type) {
		path = `${type}/_msearch`;
	} else {
		path = "_msearch";
	}

	return client.performFetchRequest({
		method: "POST",
		path,
		params: args,
		body
	});
};
