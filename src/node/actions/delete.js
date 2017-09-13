import validate from "../../helpers";

const deleteService = function deleteService(client, args) {
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
		method: "DELETE",
		path,
		params: args
	})
};


export default deleteService;
