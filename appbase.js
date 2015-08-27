var hyperquest = require('hyperquest')
var JSONStream = require('JSONStream')
var querystring = require('querystring')

var streamDocumentService = require('./get.js')
var streamSearchService = require('./search.js')

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

appbaseClient.prototype.performStreamingRequest =  function performStreamingRequest(args) {
	var method = args.method
	var path = args.path
	var params = args.params
	var body = args.body
	if(!body || typeof body !== 'object') {
		body = {}
	}

	var response
	var requestStream = hyperquest({
		method: method,
		uri: this.url + '/' + this.appname + '/' + path + '?' + querystring.stringify(params),
		auth: this.username + ':' + this.password
	})
	requestStream.on('response', function(res) {
		response = res
	})

	var resultStream = requestStream.pipe(JSONStream.parse())

	resultStream.stopStream = function stopStream() {
		if(response) {
			response.destroy()
		} else {
			requestStream.on('response', function(res) {
				res.destroy()
			})
		}
	}

	requestStream.on('end', function() {
		resultStream.stopStream()
	})

	resultStream.on('end', function() {
		resultStream.stopStream()
	})

	requestStream.on('error', function(err) {
		resultStream.stopStream()
		process.nextTick(function() {
			resultStream.emit('error', err)
		})
	})

	resultStream.getQueryId = function getQueryId(callback) {
		if(response) {
			callback(response.headers['query-id'])
		} else {
			requestStream.on('response', function(res) {
				callback(res.headers['query-id'])
			})
		}
	}

	resultStream.reconnectStream = function reconnectStream() {
		resultStream.stopStream()
		return performStreamingRequest(args)
	}

	if(requestStream.writable) {
		requestStream.end(JSON.stringify(body))
	}

	return resultStream
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