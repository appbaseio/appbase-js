# appbase-js

Appbase.io streaming client lib for Node.JS and Javascript (browser builds in [/browser/](https://github.com/appbaseio/appbase-js/tree/master/browser)), can be used with [elasticsearch.js](https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/index.html).

## Quick Example

#### Step 1: Add some data into the app (uses elasticsearch.js)
```js
// app and authentication configurations 
const HOSTNAME = "scalr.api.appbase.io"
const APPNAME = "createnewtestapp01"
const USERNAME = "RIvfxo1u1"
const PASSWORD = "dee8ee52-8b75-4b5b-be4f-9df3c364f59f"

// Add data into our ES "app index"
var elasticsearch = require('elasticsearch')
var client = new elasticsearch.Client({
			host: 'https://'+USERNAME+":"+PASSWORD+"@"+HOSTNAME,
			apiVersion: '1.6'
		});
client.index({
    index: APPNAME,
    type: "product",
    id: "1",
    body: {
        name: 'A green door',
        price: 12.50,
        tags: ['home', 'green'],
        stores: ['Walmart', 'Target']
    }
}, function(err, res) {
    if (!err)
      console.log(res);
});
```

#### Step 2: Stream the Document Updates

```js
var appbase = require('appbase-js')
var streamingClient = appbase.newClient({
      url: 'https://'+HOSTNAME,
      appname: APPNAME,
      username: USERNAME,
      password: PASSWORD
});
streamingClient.streamDocument({
      type: 'product',
      id: '1'
}).on('data', function(res) {
      // client would emit "data" event every time there is a document update.
      console.log(res)
}).on('error', function(err) {
      console.log(err)
      return
})
```

#### Console Output

```js
{ _index: 'app`248',
  _type: 'product',
  _id: '1',
  _version: 4,
  found: true,
  _source: 
   { name: 'A green door',
     price: 12.5,
     tags: [ 'home', 'green' ],
     stores: [ 'Walmart', 'Target' ] } }
```

streamDocument() returns a ``stream.Readable`` object, which can be conveniently listened via the 'on("data")' event listener. 

## API Reference

### Global

**[appbase.newClient(args)](https://github.com/appbaseio/appbase-js/blob/master/appbase.js#L10)**  

Returns a ``client`` object on which streaming requests can be performed.

> **args** - A set of key/value pairs that configures the ElasticSearch Index  
&nbsp;&nbsp;&nbsp;&nbsp;url: "https://scalr.api.appbase.io"  
&nbsp;&nbsp;&nbsp;&nbsp;appname: App name (equivalent to an ElasticSearch Index)  
&nbsp;&nbsp;&nbsp;&nbsp;username: App's username  
&nbsp;&nbsp;&nbsp;&nbsp;password: App's password key

### Client

**[client.streamDocument(args)](https://github.com/appbaseio/appbase-js/blob/master/appbase.js#L44)** 

Get all the document changes as a stream. Returns a [``stream.Readable``](https://nodejs.org/api/stream.html#stream_class_stream_readable) object.

> **args** - A set of key/value pairs that makes the document URL  
&nbsp;&nbsp;&nbsp;&nbsp;type: ElasticSearch Type  
&nbsp;&nbsp;&nbsp;&nbsp;id: Document ID

**[client.streamSearch(args)](https://github.com/appbaseio/appbase-js/blob/master/appbase.js#L48)** 

Get all the query results as a stream. Returns a [``stream.Readable``](https://nodejs.org/api/stream.html#stream_class_stream_readable) object.

> **args** - A set of key/value pairs that makes the document URL  
&nbsp;&nbsp;&nbsp;&nbsp;type: ElasticSearch Type  
&nbsp;&nbsp;&nbsp;&nbsp;id: Document ID
