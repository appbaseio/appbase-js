var URL = require('url')

var betterWs = require('./better_websocket.js')
var streamingRequest = require('./streaming_request.js')
var wsRequest = require('./websocket_request.js')

var indexService = require('./actions/index.js')
var getService = require('./actions/get.js')
var updateService = require('./actions/update.js')
var deleteService = require('./actions/delete.js')
var bulkService = require('./actions/bulk.js')
var searchService = require('./actions/search.js')
var getTypesService = require('./actions/get_types.js')

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
	this.credentials = parsedUrl.auth
	this.appname = args.appname

	if(typeof this.protocol !== 'string' || this.protocol === '') {
		throw new Error('Protocol not present in url. URL should be of the form https://scalr.api.appbase.io')
	}

	if(typeof args.username === 'string' && args.username !== '' && typeof args.password === 'string' && args.password !== '') {
		this.credentials = args.username + ':' + args.password
	}

	if(typeof this.credentials !== 'string' || this.credentials === '') {
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

	var client = {}

	client.index = this.index.bind(this)
	client.get = this.get.bind(this)
	client.update = this.update.bind(this)
	client.delete = this.delete.bind(this)
	client.bulk = this.bulk.bind(this)
	client.search = this.search.bind(this)
	client.getStream = this.getStream.bind(this)
	client.searchStream = this.searchStream.bind(this)
	client.getTypes = this.getTypes.bind(this)

	return client
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

appbaseClient.prototype.get = function get(args) {
	return new getService(this, args)
}

appbaseClient.prototype.update = function update(args) {
	return new updateService(this, args)
}

appbaseClient.prototype.delete = function deleteDocument(args) {
	return new deleteService(this, args)
}

appbaseClient.prototype.bulk = function bulk(args) {
	return new bulkService(this, args)
}

appbaseClient.prototype.search = function search(args) {
	return new searchService(this, args)
}

appbaseClient.prototype.getStream = function getStream(args) {
	return new streamDocumentService(this, args)
}

appbaseClient.prototype.searchStream = function searchStream(args) {
	return new streamSearchService(this, args)
}

appbaseClient.prototype.getTypes = function getTypes() {
	return new getTypesService(this)
}

if(typeof window !== 'undefined') {
	window.Appbase = appbaseClient
}

module.exports = appbaseClient