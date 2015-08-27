var streamSearchService = function streamSearchService(client, args) {
	this.args = args

	var valid = this.validate()
	if(valid !== true) {
		throw valid
		return
	}
	var type = args.type
	var body = args.body
	delete args.type
	delete args.body

	args.stream = "true"

	return client.performStreamingRequest({
		method: 'POST',
		path: type + '/_search',
		params: args,
		body: body
	})
}

streamSearchService.prototype.validate = function validate() {
	var invalid = []
	if(this.args.type === "") {
		invalid += 'type'
	}
	if(this.args.body === "") {
		invalid += 'body'
	}

	if(invalid.length > 0) {
		return new Error('fields missing: ' + invalid[0])
	}

	return true
}

module.exports = streamSearchService