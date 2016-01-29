Tinytest.add('index', function(test) {
	var c = new Appbase({
		url: 'http://QEVrcElba:5c13d943-a5d1-4b05-92f3-42707d49fcbb@scalr.api.appbase.io',
		appname: 'es2test1'
	})

	var r = c.index({
		type: 'tweet',
		id: '1',
		body: {
			foo: 'bar'
		}
	})

	test.equal(r._id, '1')
})

Tinytest.add('searchStream', function(test) {
	var c = new Appbase({
		url: 'http://QEVrcElba:5c13d943-a5d1-4b05-92f3-42707d49fcbb@scalr.api.appbase.io',
		appname: 'es2test1'
	})

	c.index({
		type: 'tweet',
		id: '1',
		body: {
			foo: 'bar'
		}
	})

	var r = c.searchStream({
		type: 'tweet',
		body: {
			query: {
				match_all: {}
			}
		}
	})

	c.index({
		type: 'tweet',
		id: '1',
		body: {
			foo: 'boo'
		}
	})

	var first = true
	Tracker.autorun(function(c) {
		if (first) {
			return
		}

		var res = r.get()
		for (var i = 0; i < res.length; i++) {
			if (res[i]._id === '1') {
				test.equal(res[i]._source.foo, 'boo')
				c.stop()
				return
			}
		}

		c.stop()
		throw new Error('Did not receive desired object')
	})

	//setTimeout(, 5000)
})