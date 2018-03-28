import { validate } from "../helpers";

export default function getService(client, args) {
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

	const path = `${type}/${id}`;

	return client.performFetchRequest({
		method: "GET",
		path,
		params: args
	});
};
