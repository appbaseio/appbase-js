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
      id,
      body: tweet,
    });
    const getRes = await client.get({
      id,
    });
    expect(getRes.found).toEqual(true);
  });

  test('should get one document: id as number', async () => {
    const tweet = { user: 'olivere', message: 'Welcome to Golang and Elasticsearch.' };
    const id = new Date().getTime();
    await client.index({
      id,
      body: tweet,
    });
    const getRes = await client.get({
      id,
    });
    expect(getRes.found).toEqual(true);
  });

  test('should throw error: id as object', async () => {
    const tweet = { user: 'olivere', message: 'Welcome to Golang and Elasticsearch.' };
    const id = { key: 'ded' };
    try {
      const res = await client.get({
        id,
        body: tweet,
      });
      expect(true).toBe(false)
    } catch(e) {
      expect(e.message).toEqual("fields missing: id, ")
    }
  });
});
