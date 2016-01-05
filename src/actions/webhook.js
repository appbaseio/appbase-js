var murmur = require('murmur')

var helpers = require('../helpers')

var webhookServices = {}

webhookServices.addWebhook = function addWebhook(client, args) {
	var valid = helpers.validate(args, {
		'type': 'string',
		'query': 'object'
	})
	if(valid !== true) {
		throw valid
		return
	}

	var webhooks = []
	var query = args.query
	var id = args.id
	var type = args.type

	if(typeof args.url === 'string') {
		var webhook = {}
		webhook.url = args.url
		webhook.method = 'GET'
		webhooks.push(webhook)
	} else if(args.webhook.constructor === Array) {
		webhooks = args.webhook
	} else if(args.webhook === Object(args.webhook)) {
		webhooks.push(args.webhook)
	} else {
		throw new Error('fields missing: one of webhook or url fields is required')
		return
	}

	delete args.url
	delete args.webhook
	delete args.query
	delete args.id
	delete args.type

	var body = {}
	body.webhooks = webhooks
	body.query = query
	body.type = type

	var path = '.percolator/webhooks-0-' + type + '-0-'
	if(id) {
		path = path + id
	} else {
		var hash = murmur.hash128(JSON.stringify(query)).hex()
		path = path + hash
	}

	return client.performStreamingRequest({
		method: 'POST',
		path: path,
		params: args,
		body: body
	})
}

webhookServices.deleteWebhook = function deleteWebhook(client, args) {
	var valid = helpers.validate(args, {
		'type': 'string'
	})
	if(valid !== true) {
		throw valid
		return
	}

	var id = args.id
	var type = args.type
	var query = args.query

	if( !(typeof id === 'string' || query === Object(query)) ) {
		throw new Error('fields missing: id or query required')
	}

	var path = '.percolator/webhooks-0-' + type + '-0-'
	if(id) {
		path = path + id
	} else {
		var hash = murmur.hash128(JSON.stringify(query)).hex()
		path = path + hash
	}

	delete args.query
	delete args.id
	delete args.type

	return client.performStreamingRequest({
		method: 'DELETE',
		path: path,
		params: args
	})
}

module.exports=webhookServices