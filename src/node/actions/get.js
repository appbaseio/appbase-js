import validate from "../../helpers";

const getService = function getService(client, args) {
	const valid = validate(args, {
		"type": "string",
		"id": "string"
	});

	if(valid !== true) {
		throw valid
		return
	}
	const type = args.type;
	const id = args.id;
	delete args.type
	delete args.id

	const path = `${type}/${id}`;

	return client.performStreamingRequest({
		method: "GET",
		path,
		params: args
	})
};


export default getService;
