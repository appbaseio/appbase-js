var streamDocumentService = function streamDocumentService(client, args) {
	this.args = args

	var valid = this.validate()
	if(valid !== true) {
		throw valid
		return
	}
	var type = args.type
	var id = args.id
	delete args.type
	delete args.id

	args.stream = "true"

	return client.performStreamingRequest({
		method: 'GET',
		path: type + '/' + id,
		params: args,
	})
}

streamDocumentService.prototype.validate = function validate() {
	var invalid = []
	if(this.args.type === "") {
		invalid += 'type'
	}
	if(this.args.id === "") {
		invalid += 'id'
	}

	if(invalid.length > 0) {
		return new Error('fields missing: ' + invalid[0])
	}

	return true
}

module.exports = streamDocumentService