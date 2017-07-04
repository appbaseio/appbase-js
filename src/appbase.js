var URL = require('url')
var Guid = require('guid')

var helpers = require('./helpers.js')
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
var addWebhookService = require('./actions/webhook.js')

var streamDocumentService = require('./actions/stream_document.js')
var streamSearchService = require('./actions/stream_search.js')

var appbaseClient = function appbaseClient(args) {
	if (!(this instanceof appbaseClient)) {
		return new appbaseClient(args)
	}

	if (typeof args.url !== 'string' || args.url === '') {
		throw new Error('URL not present in options.')
	}

	var parsedUrl = URL.parse(args.url)

	this.url = parsedUrl.host
	this.protocol = parsedUrl.protocol
	this.credentials = parsedUrl.auth
	this.appname = args.appname || args.app || args.index
	this.channel_id = Guid.raw().replace(/-/g, '')

	/* appname is not required in Streams; there, it can be passed
	 * as index name and on each request */
	if (helpers.isAppbase(this) && (typeof this.appname !== 'string' || this.appname === '')) {
		throw new Error('App name is not present in options.')
	}

	if (typeof this.protocol !== 'string' || this.protocol === '') {
		throw new Error('Protocol is not present in url. URL should be of the form https://scalr.api.appbase.io')
	}

	if (typeof args.username === 'string' && args.username !== '' && typeof args.password === 'string' && args.password !== '') {
		this.credentials = args.username + ':' + args.password
	}

	// credentials can be provided as a part of the URL, as username, password args or
	// as a credentials argument directly
	if (typeof args.credentials === 'string' && args.credentials !== '') {
		this.credentials = args.credentials
	}

	/* credentials are not required for Streams */
	if (helpers.isAppbase(this) && (typeof this.credentials !== 'string' || this.credentials === '')) {
		throw new Error('Authentication information is not present. Did you add credentials?')
	}

	if (parsedUrl.protocol === 'https:') {
		var appname = helpers.isAppbase(this) ? this.appname : ''
		var url = 'wss://' + this.credentials + '@' + parsedUrl.host + '/' + appname +
			'?sub_to_chan=' + this.channel_id
		this.ws = new betterWs(url)
	} else {
		var appname = helpers.isAppbase(this) ? this.appname : ''
		var url = 'ws://' + this.credentials + '@' + parsedUrl.host + '/' +
			appname + '?sub_to_chan=' + this.channel_id
		this.ws = new betterWs(url)
	}

	if (this.url.slice(-1) === "/") {
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
	client.searchStreamToURL = this.searchStreamToURL.bind(this)
	client.getTypes = this.getTypes.bind(this)

	return client
}

appbaseClient.prototype.performWsRequest = function performWsRequest(args) {
	if (!this.appname) {
		this.appname = args.index
	}
	return new wsRequest(this, JSON.parse(JSON.stringify(args)))
}

appbaseClient.prototype.performStreamingRequest = function performStreamingRequest(args) {
	if (!this.appname) {
		this.appname = args.index
	}
	return new streamingRequest(this, JSON.parse(JSON.stringify(args)))
}

appbaseClient.prototype.index = function index(args) {
	if (!this.appname) {
		this.appname = args.index
	}
	return new indexService(this, JSON.parse(JSON.stringify(args)))
}

appbaseClient.prototype.get = function get(args) {
	if (!this.appname) {
		this.appname = args.index
	}
	return new getService(this, JSON.parse(JSON.stringify(args)))
}

appbaseClient.prototype.update = function update(args) {
	if (!this.appname) {
		this.appname = args.index
	}
	return new updateService(this, JSON.parse(JSON.stringify(args)))
}

appbaseClient.prototype.delete = function deleteDocument(args) {
	if (!this.appname) {
		this.appname = args.index
	}
	return new deleteService(this, JSON.parse(JSON.stringify(args)))
}

appbaseClient.prototype.bulk = function bulk(args) {
	if (!this.appname) {
		this.appname = args.index
	}
	return new bulkService(this, JSON.parse(JSON.stringify(args)))
}

appbaseClient.prototype.search = function search(args) {
	if (!this.appname) {
		this.appname = args.index
	}
	return new searchService(this, JSON.parse(JSON.stringify(args)))
}

appbaseClient.prototype.getStream = function getStream(args) {
	if (!this.appname) {
		this.appname = args.index
	}
	return new streamDocumentService(this, JSON.parse(JSON.stringify(args)))
}

appbaseClient.prototype.searchStream = function searchStream(args) {
	if (!this.appname) {
		this.appname = args.index
	}
	return new streamSearchService(this, JSON.parse(JSON.stringify(args)))
}

appbaseClient.prototype.searchStreamToURL = function searchStreamToURL(args, webhook) {
	if (!this.appname) {
		this.appname = args.index
	}
	return new addWebhookService(this, JSON.parse(JSON.stringify(args)), JSON.parse(JSON.stringify(webhook)))
}

appbaseClient.prototype.getTypes = function getTypes(args) {
	if (!this.appname) {
		this.appname = args.index
	}
	return new getTypesService(this, JSON.parse(JSON.stringify(args)))
}

if (typeof window !== 'undefined') {
	window.Appbase = appbaseClient
}

module.exports = appbaseClient
