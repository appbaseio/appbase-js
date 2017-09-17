const getMappingsService = function getMappingsService(client) {
	return client.performFetchRequest({
		method: "GET",
		path: "_mapping"
	})
};

export default getMappingsService;