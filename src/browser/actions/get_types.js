import through2 from "through2";

const getTypesService = function getTypesService(client) {
	const resultStream = through2.obj(function(chunk, enc, callback) {
		const appname = Object.keys(chunk)[0];
		const types = Object.keys(chunk[appname]["mappings"]).filter(type => type !== "_default_");
		this.push(types)

		callback()
	});
	resultStream.writable = false

	return client.performFetchRequest({
		method: "GET",
		path: "_mapping"
	}).pipe(resultStream)
};

export default getTypesService;