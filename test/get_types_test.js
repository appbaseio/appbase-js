var assert = require('assert')

var getTypesTests = {}

getTypesTests.getAllTypes = function getAllTypes(streamingClient, done) {
	streamingClient.getTypes()
	.on('error', done)
	.on('data', function(types) {
		if(types && types instanceof Array) {
			if(types.length > 0) {
				done()
			} else {
				done(new Error('No type is present in the array.'))
			}
		} else {
			done(new Error('The object received is not an array.'))
		}
	})
}

module.exports = getTypesTests