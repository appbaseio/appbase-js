const appbase = require('..');
const { uuidv4 } = require('../__mocks__');
const config = require('../__mocks__/defaultConfig');

describe('#Get', function() {
  let client;
  beforeAll(() => {
    client = appbase({
      url: config.URL,
      app: config.APPNAME,
      credentials: config.CREDENTIALS,
    });
  });

  test('should get one document', async () => {
    const tweet = { user: 'olivere', message: 'Welcome to Golang and Elasticsearch.' };
    const id = uuidv4();
    await client.index({
      type: 'tweet_get',
      id,
      body: tweet,
    });
    const getRes = await client.get({
      type: 'tweet_get',
      id,
    });
    expect(getRes.found).toEqual(true);
  });
});
