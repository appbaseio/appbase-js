import hyperquest from "hyperquest";
import JSONStream from "JSONStream";
import querystring from "querystring";
import through2 from "through2";

class streamingRequest {
    constructor(client, args) {
        this.client = client;
        this.args = args;

        this.method = args.method;
        this.path = args.path;
        this.params = args.params;
        this.body = args.body;
        
        if(!this.body || !(typeof this.body === "object" || this.body.constructor === Array) ) {
            this.body = {};
        }
        
        if(this.body.constructor === Array) {
            const arrayBody = this.body;
            this.body = "";
            for(let i=0; i < arrayBody.length; i++) {
                this.body += JSON.stringify(arrayBody[i]);
                this.body += "\n";
            }
        }
        
        const resultStream = this.init();

        return resultStream;
    }

    init() {
        const that = this;

        this.requestStream = hyperquest({
            method: this.method,
            uri:  `${this.client.protocol}//${this.client.url}/${this.client.appname}/${this.path}?${querystring.stringify(this.params)}`,
            auth: this.client.credentials
        });

        this.requestStream.on("response", res => {
            that.response = res;
        })

        this.requestStream.on("request", req => {
            that.request = req;
        })

        const resultStream = this.requestStream.pipe(JSONStream.parse()).pipe(through2.obj());

        this.requestStream.on("end", () => {
            that.stop.apply(that);
        })

        resultStream.on("end", () => {
            that.stop.apply(that);
        })

        this.requestStream.on("error", err => {
            that.stop.apply(that);
            process.nextTick(() => {
                resultStream.emit("error", err);
            })
        })

        resultStream.stop = this.stop.bind(this);
        resultStream.reconnect = this.reconnect.bind(this);

        if(this.requestStream.writable) {
            if(typeof this.body === "string") {
                this.requestStream.end(this.body);
            } else {
                this.requestStream.end(JSON.stringify(this.body));
            }
        }

        return resultStream;
    }

    getId(callback) {
        if(this.response) {
            callback(this.response.headers["query-id"]);
        } else {
            this.requestStream.on("response", res => {
                callback(res.headers["query-id"]);
            })
        }
    }

    stop() {
        if(this.request) {
            this.request.destroy();
        } else {
            this.requestStream.on("request", req => {
                req.destroy();
            })
        }
    }

    reconnect() {
        this.stop();
        return new streamingRequest(this.client, this.args);
    }
}

export default streamingRequest;
