import { validate } from "../helpers";

const indexService = function indexService(client, args) {
	const valid = validate(args, {
		"type": "string",
		"body": "object"
	});
	if(valid !== true) {
		throw valid
		return
	}
	const type = args.type;
	const id = args.id;
	const body = args.body;
	delete args.type
	delete args.id
	delete args.body

	let path;
	if(id) {
		path = `${type}/${id}`
	} else {
		path = type
	}

	return client.performFetchRequest({
		method: "POST",
		path,
		params: args,
		body
	})
};

export default indexService;
