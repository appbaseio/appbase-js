import validate from "../../helpers";

const bulkService = function bulkService(client, args) {
	const valid = validate(args, {
		"body": "object"
	});
	if(valid !== true) {
		throw valid
		return
	}
	const type = args.type;
	const body = args.body;
	delete args.type
	delete args.body

	let path;
	if(type) {
		path = `${type}/_bulk`
	} else {
		path = "/_bulk"
	}

	return client.performStreamingRequest({
		method: "POST",
		path,
		params: args,
		body
	})
};


export default bulkService;
