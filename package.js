Package.describe({
	name: 'appbaseio:appbase',
	version: '0.10.5',
	summary: 'Appbase.io streaming client library for Meteor',
	git: 'https://github.com/appbaseio/appbase-js',
	documentation: 'README.md'
});

Npm.depends({
	"appbase-js": "0.10.5",
	"fibers": "1.0.8"
});

Package.onUse(function(api) {
	api.versionsFrom('1.2.1');
	api.use('ecmascript');
	api.use('reactive-var');

	api.addFiles('meteor/appbase.js', 'server');
	//api.addFiles('browser/appbase.js', ['client']);

	api.export('Appbase', 'server');
});

Package.onTest(function(api) {
	api.use('ecmascript');
	api.use('tinytest');
	api.use('appbaseio:appbase');
	api.addFiles('meteor/appbase-tests.js', 'server');
});