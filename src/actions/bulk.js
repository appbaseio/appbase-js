import { validate } from "../helpers";

const bulkService = function bulkService(client, args) {
	const valid = validate(args, {
		"body": "object"
	});
	if (valid !== true) {
		throw valid;
		return;
	}

	const { type, body } = args;

	delete args.type;
	delete args.body;

	let path;
	if (type) {
		path = `${type}/_bulk`;
	} else {
		path = "/_bulk";
	}

	return client.performFetchRequest({
		method: "POST",
		path,
		params: args,
		body
	});
};


export default bulkService;
