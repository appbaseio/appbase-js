var ajs = Npm.require('appbase-js')
var Future = Npm.require('fibers/future')

Appbase = function Appbase(args) {
	if (!(this instanceof Appbase)) {
		return new Appbase(args)
	}

	this.ajsClient = new ajs(args)

	var client = {}

	client.index = this.varReturn.bind(this)("index")
	client.get = this.varReturn.bind(this)("get")
	client.update = this.varReturn.bind(this)("update")
	client.delete = this.varReturn.bind(this)("delete")
	client.bulk = this.varReturn.bind(this)("bulk")
	client.search = this.varReturn.bind(this)("search")
	client.searchStreamToURL = this.varReturn.bind(this)("searchStreamToURL")
	client.getTypes = this.varReturn.bind(this)("getTypes")

	//client.getStream = this.reactiveVarReturn.bind(this)("get", "getStream")
	client.searchStream = this.searchStream.bind(this)

	return client
}

Appbase.prototype.varReturn = function varReturn(name) {
	return (function(...args) {
		var future = new Future
		this.ajsClient[name](...args)
			.on('data', Meteor.bindEnvironment(function(d) {
				future.return(d)
			}))
			.on('error', Meteor.bindEnvironment(function(e) {
				future.error(e)
			}))

		return future.wait()
	}).bind(this)
}

Appbase.prototype.searchStream = function searchStream(...args) {
	var applyUpdate = function applyUpdate(res, d) {
		for (var i = 0; i < res.length; i++) {
			if (res[i]._type === d._type && res[i]._id === d._id) {
				res.splice(i)
				if (!d._deleted) {
					delete d._updated
					res.push(d)
				}
			}
		}
	}

	var res = this.varReturn.bind(this)("search")(...args).hits.hits
	var rvar = new ReactiveVar(JSON.parse(JSON.stringify(res)))
	this.ajsClient.searchStream(...args)
		.on('data', Meteor.bindEnvironment(function(d) {
			applyUpdate(res, d)
			rvar.set(JSON.parse(JSON.stringify(res)))
		}))
		.on('error', Meteor.bindEnvironment(function(e) {
			throw e
		}))

	return rvar
}