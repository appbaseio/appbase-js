'use strict';

var searchService = function searchService(client, args) {
	this.args = args;

	var valid = this.validate();
	if (valid !== true) {
		throw valid;
		return;
	}
	var type = args.type;
	var body = args.body;
	delete args.type;
	delete args.body;

	var path;
	if (type) {
		path = type + '/_search';
	} else {
		path = '/_search';
	}

	return client.performStreamingRequest({
		method: 'POST',
		path: path,
		params: args,
		body: body
	});
};

searchService.prototype.validate = function validate() {
	var invalid = [];
	if (typeof this.args.body !== 'object' || this.args.body === null) {
		invalid.push('body');
	}

	var missing = '';
	for (var i = 0; i < invalid.length; i++) {
		missing += invalid[i] + ', ';
	}

	if (invalid.length > 0) {
		return new Error('fields missing: ' + missing);
	}

	return true;
};

module.exports = searchService;
