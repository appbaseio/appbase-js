var URL = require('url')

var betterWs = require('./better_websocket.js')
var streamingRequest = require('./streaming_request.js')
var wsRequest = require('./websocket_request.js')

var indexService = require('./actions/index.js')
var updateService = require('./actions/update.js')
var deleteService = require('./actions/delete.js')
var bulkService = require('./actions/bulk.js')
var searchService = require('./actions/search.js')

var streamDocumentService = require('./actions/stream_document.js')
var streamSearchService = require('./actions/stream_search.js')

var appbaseClient = function appbaseClient(args) {
	if ( !(this instanceof appbaseClient) ) {
		return new appbaseClient()
	}

	if(typeof args.appname !== 'string' || args.appname === '') {
		throw new Error('Appname not present is options.')
	}

	if(typeof args.url !== 'string' || args.url === '') {
		throw new Error('URL not present is options.')
	}

	var parsedUrl = URL.parse(args.url)

	this.url = parsedUrl.host
	this.protocol = parsedUrl.protocol
	this.auth = parsedUrl.auth
	this.appname = args.appname

	if(typeof this.protocol !== 'string' || this.protocol === '') {
		throw new Error('Protocol not present in url. URL should be of the form https://scalr.api.appbase.io')
	}

	if(typeof args.username === 'string' && args.username !== '' && typeof args.password === 'string' && args.password !== '') {
		this.auth = args.username + ':' + args.password
	}

	if(typeof this.auth !== 'string' || this.auth === '') {
		throw new Error('Authentication information not present.')
	}

	if(parsedUrl.protocol === 'https:') {
		this.ws = new betterWs('wss://' + parsedUrl.host)
	} else {
		this.ws = new betterWs('ws://' + parsedUrl.host)
	}

	if(this.url.slice(-1) === "/") {
		this.url = this.url.slice(0, -1)
	}
}

appbaseClient.prototype.performWsRequest = function performWsRequest(args) {
	return new wsRequest(this, args)
}

appbaseClient.prototype.performStreamingRequest = function performStreamingRequest(args) {
	return new streamingRequest(this, args)
}

appbaseClient.prototype.index = function index(args) {
	return new indexService(this, args)
}

appbaseClient.prototype.update = function update(args) {
	return new updateService(this, args)
}

appbaseClient.prototype.deleteDocument = function deleteDocument(args) {
	return new deleteService(this, args)
}

appbaseClient.prototype.bulk = function bulk(args) {
	return new bulkService(this, args)
}

appbaseClient.prototype.search = function search(args) {
	return new searchService(this, args)
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