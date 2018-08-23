const appbase = require('..');
const { uuidv4 } = require('../__mocks__');
const config = require('../__mocks__/defaultConfig');

describe('#Search', function() {
  let client;
  beforeAll(() => {
    client = appbase({
      url: config.URL,
      app: config.APPNAME,
      credentials: config.CREDENTIALS,
    });
  });

  test('should return results', async () => {
    var tweet = { user: 'olivere', message: 'Welcome to Golang and Elasticsearch.' };
    await client.index({
      type: 'tweet_search',
      id: uuidv4(),
      body: tweet,
    });
    const res = await client.search({
      type: 'tweet_search',
      body: {
        query: {
          match_all: {},
        },
      },
    });
    expect(res.hits.total).toBeGreaterThan(0);
  });
});
