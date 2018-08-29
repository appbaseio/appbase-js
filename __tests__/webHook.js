const appbase = require('..');
const { uuidv4 } = require('../__mocks__');
const config = require('../__mocks__/defaultConfig');

describe('#WebHook', () => {
  let client;
  beforeAll(() => {
    client = appbase({
      url: config.URL,
      app: config.APPNAME,
      credentials: config.CREDENTIALS,
    });
  });

  test('should register webhook', async () => {
    const tweet = { user: 'olivere', message: 'Welcome to Golang and Elasticsearch.' };
    const id = uuidv4();
    await client.index({
      type: 'tweet_webhook',
      id,
      body: tweet,
    });
    client.searchStreamToURL(
      {
        type: 'tweet_webhook',
        body: {
          query: {
            match_all: {},
          },
        },
      },
      {
        url: 'http://requestb.in/v0mz3hv0?inspect',
        interval: 60,
      },
      () => {
        expect(true).toEqual(true);
      },
      () => {
        expect(false).toEqual(true);
      },
    );
  });
});
