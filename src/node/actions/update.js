import validate from "../../helpers";

const updateService = function updateService(client, args) {
	const valid = validate(args, {
		"type": "string",
		"id": "string",
		"body": "object"
	});
	if (valid !== true) {
		throw valid
		return
	}
	const type = args.type;
	const id = args.id;
	const body = args.body;
	delete args.type
	delete args.id
	delete args.body

	const path = `${type}/${id}/_update`;

	return client.performStreamingRequest({
		method: "POST",
		path,
		params: args,
		body
	})
};


export default updateService;