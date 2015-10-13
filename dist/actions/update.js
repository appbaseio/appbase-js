'use strict';

var updateService = function updateService(client, args) {
	this.args = args;

	var valid = this.validate();
	if (valid !== true) {
		throw valid;
		return;
	}
	var type = args.type;
	var id = args.id;
	var body = args.body;
	delete args.type;
	delete args.id;
	delete args.body;

	var path = type + '/' + id + '/_update';

	return client.performStreamingRequest({
		method: 'POST',
		path: path,
		params: args,
		body: body
	});
};

updateService.prototype.validate = function validate() {
	var invalid = [];
	if (typeof this.args.type !== 'string' || this.args.type === '') {
		invalid.push('type');
	}
	if (typeof this.args.id !== 'string' || this.args.type === '') {
		invalid.push('id');
	}
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

module.exports = updateService;
