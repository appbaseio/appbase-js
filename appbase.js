var hyperquest = require('hyperquest')
var JSONStream = require('JSONStream')
var querystring = require('querystring')

var newStreamDocumentService = require('./get.js')
var newStreamSearchService = require('./search.js')

var appbase = {}

appbase.newClient = function newClient(args) {
	var url = args.url
	var username = args.username
	var password = args.password
	var appname = args.appname

	var client = {}

	if(url.slice(-1) === "/") {
		url = url.slice(0, -1)
	}

	client.performStreamingRequest = function performStreamingRequest(args) {
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
			uri: url + '/' + appname + '/' + path + '?' + querystring.stringify(params),
			auth: username + ':' + password
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

	client.streamDocument = function streamDocument(args) {
		return newStreamDocumentService(client, args)
	}

	client.streamSearch = function streamSearch(args) {
		return newStreamSearchService(client, args)
	}

	return client
}

if(typeof window !== 'undefined') {
	window.appbase = appbase
}

module.exports = appbase