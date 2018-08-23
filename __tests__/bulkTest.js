const appbase = require('..');
const { uuidv4 } = require('../__mocks__');
const config = require('../__mocks__/defaultConfig');

describe('#Bulk', function() {
  let client;
  beforeAll(() => {
    client = appbase({
      url: config.URL,
      app: config.APPNAME,
      credentials: config.CREDENTIALS,
    });
  });

  test('should bulk index one document', async done => {
    var tweet = { user: 'olivere', message: 'Welcome to Golang and Elasticsearch.' };
    const id = uuidv4();
    await client.bulk({
      body: [
        {
          index: {
            _type: 'tweet_bulk',
            _id: id,
          },
        },
        tweet,
      ],
    });
    const res = await client.get({
      type: 'tweet_bulk',
      id: id,
    });
    delete res._version;
    delete res._index;
    delete res._timestamp;
    delete res._headers;
    try {
      expect(res).toEqual({
        _type: 'tweet_bulk',
        _id: id,
        found: true,
        _source: tweet,
      });
    } catch (e) {
      return done(e);
    }

    const deleteRes = await client.delete({
      type: 'tweet_bulk',
      id: id,
    });
    if (deleteRes && deleteRes.found) {
      done();
    } else {
      done(new Error('Unable to delete data because it was not found'));
    }
  });
  test('should throw error if body is missing', function() {
    try {
      client.bulk({});
    } catch (e) {
      expect(true).toEqual(true);
    }
  });

  test('should throw error when no arguments is passed', function() {
    try {
      client.bulk();
    } catch (e) {
      expect(true).toEqual(true);
    }
  });
});
