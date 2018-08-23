const appbase = require('..');
const { uuidv4 } = require('../__mocks__');
const config = require('../__mocks__/defaultConfig');

describe('#Get_Stream', function() {
  let client;
  beforeAll(() => {
    client = appbase({
      url: config.URL,
      app: config.APPNAME,
      credentials: config.CREDENTIALS,
    });
  });

  test('should receive event when new document is inserted', async done => {
    const id = uuidv4();
    const tweet = {
      user: 'olivere',
      message: 'Welcome to Golang and Elasticsearch.',
    };
    await client.index({
      type: 'tweet_get_stream',
      id: id,
      body: tweet,
    });

    const responseStream = client.getStream(
      {
        type: 'tweet_get_stream',
        id: id,
      },
      data => {
        try {
          expect(data).toEqual({
            _type: 'tweet_get_stream',
            _id: id,
            _source: tweet,
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
      },
    );

    setTimeout(function() {
      client.index({
        type: 'tweet_get_stream',
        id: id,
        body: tweet,
      });
    }, 2000);
  });
  test('should not receive initial data', async done => {
    const tweet = {
      user: 'olivere',
      message: 'Welcome to Golang and Elasticsearch.',
    };
    const id = uuidv4();
    await client.index({
      type: 'tweet_get_stream',
      id,
      body: tweet,
    });
    const responseStream = client.getStream(
      {
        type: 'tweet_get_stream',
        id,
        streamonly: true,
      },
      res => {
        try {
          expect(res).toEqual({
            _type: 'tweet_get_stream',
            _id: id,
            _source: tweet,
          });
        } catch (e) {
          responseStream.stop();
          return done(e);
        }

        responseStream.stop();
        done();
      },
    );

    setTimeout(function() {
      client.index({
        type: 'tweet_get_stream',
        id,
        body: tweet,
      });
    }, 2000);
  });
  test('should receive only one event', async done => {
    const tweet = {
      user: 'olivere',
      message: 'Welcome to Golang and Elasticsearch.',
    };
    const id = uuidv4();
    await client.index({
      type: 'tweet_get_stream',
      id,
      body: tweet,
    });
    let first = true;
    const responseStream = client.getStream(
      {
        type: 'tweet_get_stream',
        id,
      },
      async res => {
        if (first) {
          await client.index({
            type: 'tweet_get_stream',
            id: id,
            body: tweet,
          });
          responseStream.stop();
          first = false;
          setTimeout(function() {
            done();
          }, 2000);
        } else {
          done(new Error('Received second event'));
        }
      },
      error => {
        if (error) {
          done(error);
          return;
        }
      },
    );
    setTimeout(async function() {
      await client.index({
        type: 'tweet_get_stream',
        id: id,
        body: tweet,
      });
    }, 2000);
  });
});
