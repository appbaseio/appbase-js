import { validate } from "../helpers";

const searchService = function searchService(client, args) {
	const valid = validate(args, {
		"body": "object"
	});
	if(valid !== true) {
		throw valid
		return
	}

	let type;
	if(args.type.constructor === Array) {
		type = args.type.join()
	} else {
		type = args.type
	}

	const body = args.body;
	delete args.type
	delete args.body

	let path;
	if(type) {
		path = `${type}/_search`
	} else {
		path = "/_search"
	}

	return client.performFetchRequest({
		method: "POST",
		path,
		params: args,
		body
	})
};

export default searchService;
