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

  test('should update one document', async done => {
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
      type: 'tweet_update',
      id,
      body: tweet,
    });

    var responseStream = client.getStream(
      {
        type: 'tweet_update',
        id,
      },
      data => {
        try {
          expect(data).toEqual({
            _type: 'tweet_update',
            _id: id,
            _source: tweet2,
            _updated: true,
          });
        } catch (e) {
          responseStream.stop();
          return done(e);
        }
        responseStream.stop();
        done();
      },
      error => {
        if (error) {
          done(error);
          return;
        }
        // throw error;
      },
    );
    setTimeout(async () => {
      await client.update({
        type: 'tweet_update',
        id,
        body: {
          doc: tweet2,
        },
      });
    }, 2000);
  });
});
