var streamingRequest = require('./streaming_request.js')
var streamDocumentService = require('./actions/stream_document.js')
var streamSearchService = require('./actions/stream_search.js')

var appbaseClient = function appbaseClient(args) {
	if ( !(this instanceof appbaseClient) ) {
		return new appbaseClient()
	}

	this.url = args.url
	this.username = args.username
	this.password = args.password
	this.appname = args.appname

	if(this.url.slice(-1) === "/") {
		this.url = this.url.slice(0, -1)
	}
}

appbaseClient.prototype.performStreamingRequest = function performStreamingRequest(args) {
	return new streamingRequest(this, args)
}

appbaseClient.prototype.streamDocument = function streamDocument(args) {
	return new streamDocumentService(this, args)
}

appbaseClient.prototype.streamSearch = function streamSearch(args) {
	return new streamSearchService(this, args)
}

if(typeof window !== 'undefined') {
	window.appbase = appbaseClient
}

module.exports = appbaseClient