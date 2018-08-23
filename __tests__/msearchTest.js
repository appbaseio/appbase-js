const appbase = require('..');
const { uuidv4 } = require('../__mocks__');
const config = require('../__mocks__/defaultConfig');

describe('#Msearch', function() {
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
      type: 'tweet',
      id: uuidv4(),
      body: tweet,
    });
    // index second tweet
    var penguinTweet = { user: 'penguin', message: 'woot woot!' };
    await client.index({
      type: 'tweet_msearch',
      id: uuidv4(),
      body: penguinTweet,
    });
    const res = await client.msearch({
      type: 'tweet_msearch',
      body: [{}, { query: { match_all: {} } }, {}, { query: { match: { _id: 1 } } }],
    });
    expect(res.responses.length).toEqual(2);
  });
});
