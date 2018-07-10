import { validate } from "../helpers";

export default function updateService(client, args) {
	const valid = validate(args, {
		"type": "string",
		"id": "string",
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

	const path = `${type}/${encodeURIComponent(id)}/_update`;

	return client.performFetchRequest({
		method: "POST",
		path,
		params: args,
		body
	});
};
