import { validate } from "../helpers";

export default function indexService(client, args) {
	const valid = validate(args, {
		"type": "string",
		"body": "object"
	});
	if (valid !== true) {
		throw valid;
		return;
	}

	const { type, id, body } = args;

	delete args.type;
	delete args.id;
	delete args.body;

	let path;
	if (id) {
		path = `${type}/${encodeURIComponent(id)}`;
	} else {
		path = type;
	}

	return client.performFetchRequest({
		method: "POST",
		path,
		params: args,
		body
	});
};
