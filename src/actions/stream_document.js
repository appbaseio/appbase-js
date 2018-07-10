import { validate } from "../helpers";

export default function streamDocumentService(client, args) {
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
	delete args.stream;

	if (args.stream === true || args.stream === "true") {
		args.stream = "true";
	} else {
		delete args.stream;
		args.streamonly = "true";
	}

	return client.performWsRequest({
		method: "GET",
		path: `${type}/${encodeURIComponent(id)}`,
		params: args
	});
};
