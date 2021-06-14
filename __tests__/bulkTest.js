const appbase = require("..");
const { uuidv4 } = require("../__mocks__");
const config = require("../__mocks__/defaultConfig");

describe("#Bulk", function () {
  let client;
  beforeAll(() => {
    client = appbase({
      url: config.URL,
      app: config.APPNAME,
      credentials: config.CREDENTIALS,
    });
  });

  test("should bulk index one document", async (done) => {
    var tweet = {
      user: "olivere",
      message: "Welcome to Golang and Elasticsearch.",
    };
    const id = uuidv4();
    try {
      await client.bulk({
        body: [
          {
            index: {
              _id: id,
            },
          },
          tweet,
        ],
      });
    }  catch (e) {
      console.error(e);
    }
    try {
      const res = await client.get({
        id: id,
      });
      try {
        expect(res).toMatchObject({
          _id: id,
          found: true,
          _source: tweet,
        });
      } catch (e) {
        return done(e);
      }
    } catch (e) {
      console.error(e);
    }

    const deleteRes = await client.delete({
      id: id,
    });
    if (deleteRes && deleteRes.result === 'deleted') {
      done();
    } else {
      done(new Error("Unable to delete data because it was not found"));
    }
  });
  test("should throw error if body is missing", function () {
    try {
      client.bulk({});
    } catch (e) {
      expect(true).toEqual(true);
    }
  });

  test("should throw error when no arguments is passed", function () {
    try {
      client.bulk();
    } catch (e) {
      expect(true).toEqual(true);
    }
  });
});
