const appbase = require('..');
const { uuidv4 } = require('../__mocks__');
const config = require('../__mocks__/defaultConfig');

describe('#Update', function() {
  let client;
  beforeAll(() => {
    client = appbase({
      url: config.URL,
      app: config.APPNAME,
      credentials: config.CREDENTIALS,
    });
  });

  test('should update one document', async () => {
    const id = uuidv4();
    var tweet = {
      user: 'olivere',
      message: 'Welcome to Golang and Elasticsearch.',
    };
    var tweet2 = {
      user: 'olivere',
      message: 'This is a new tweet.',
    };
    await client.index({
      id,
      body: tweet,
    });
    const updateRes = await client.update({
      id,
      body: {
        doc: tweet2
      },
    })
    expect(updateRes.result).toEqual('updated');
  });
});
