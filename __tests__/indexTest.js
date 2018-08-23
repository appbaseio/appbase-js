const appbase = require('..');
const { uuidv4 } = require('../__mocks__');
const config = require('../__mocks__/defaultConfig');

describe('#Index', function() {
  let client;
  beforeAll(() => {
    client = appbase({
      url: config.URL,
      app: config.APPNAME,
      credentials: config.CREDENTIALS,
    });
  });
  test('should get one document', async done => {
    const id = uuidv4();
    var tweet = {
      user: 'olivere',
      message: 'Welcome to Golang and Elasticsearch.',
    };
    await client.index({
      type: 'tweet_index',
      id,
      body: tweet,
    });
    const responseStream = client.getStream(
      {
        type: 'tweet_index',
        id,
      },
      data => {
        try {
          expect(data).toEqual({
            _type: 'tweet_index',
            _id: id,
            _source: tweet,
          });
        } catch (e) {
          responseStream.stop();
          return done(e);
        }
        responseStream.stop();
        done();
        responseStream.stop();
      },
      error => {
        if (error) {
          done(error);
          return;
        }
      },
    );
    setTimeout(async () => {
      await client.index({
        type: 'tweet_index',
        id,
        body: tweet,
      });
    }, 2000);
  });
});
