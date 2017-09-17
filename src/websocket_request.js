import Guid from "guid";
import querystring from "querystring";
import through2 from "through2";

const EventEmitter = require("eventemitter2").EventEmitter2;

class wsRequest {
    constructor(client, args) {
        this.client = client
        this.args = args

        this.method = args.method
        this.path = args.path
        this.params = args.params
        this.body = args.body
        if (!this.body || typeof this.body !== "object") {
            this.body = {}
        }

        const resultStream = this.init();

        return resultStream
    }

    init() {
        const that = this;

        this.id = Guid.raw()

        this.request = {
            id: this.id,
            path: `${this.client.appname}/${this.path}?${querystring.stringify(this.params)}`,
            method: this.method,
            body: this.body,
            authorization: `Basic ${new Buffer(this.client.credentials).toString("base64")}`
        }

        this.resultStream = through2.obj()
        this.resultStream.writable = false

        this.closeHandler = () => {
            that.wsClosed.apply(that)
        }
        this.errorHandler = err => {
            that.processError(...[err])
        }
        this.messageHandler = dataObj => {
            that.processMessage(...[dataObj])
        }

        this.client.ws.on("close", this.closeHandler)
        this.client.ws.on("error", this.errorHandler)
        this.client.ws.on("message", this.messageHandler)

        this.client.ws.send(this.request)

        this.resultStream.on("end", () => {
            that.resultStream.readable = false
            that.stop.apply(that)
        })

        this.resultStream.stop = this.stop.bind(this)
        this.resultStream.reconnect = this.reconnect.bind(this)

        return this.resultStream
    }

    wsClosed() {
        this.resultStream.push(null)
    }

    processError(err) {
        this.resultStream.emit("error", err)
    }

    processMessage(origDataObj) {
        const dataObj = JSON.parse(JSON.stringify(origDataObj));

        if (!dataObj.id && dataObj.message) {
            this.resultStream.emit("error", dataObj)
            return
        }

        if (dataObj.id === this.id) {
            if (dataObj.message) {
                delete dataObj.id
                this.resultStream.emit("error", dataObj)
                return
            }

            if (dataObj.query_id) {
                this.query_id = dataObj.query_id
            }

            if (dataObj.channel) {
                this.channel = dataObj.channel
            }

            if (dataObj.body && dataObj.body !== "") {
                this.resultStream.push(dataObj.body)
            }

            return
        }

        if (!dataObj.id && dataObj.channel && dataObj.channel === this.channel) {
            this.resultStream.push(dataObj.event)
            return
        }
    }

    getId(callback) {
        if (this.query_id) {
            callback(this.query_id)
        } else {
            this.client.ws.on("message", function gid(data) {
                const dataObj = JSON.parse(data);
                if (dataObj.id === that.id) {
                    if (dataObj.query_id) {
                        this.client.ws.removeListener("message", gid)
                        callback(query_id)
                    }
                }
            })
        }
    }

    stop() {
        this.client.ws.removeListener("close", this.closeHandler)
        this.client.ws.removeListener("error", this.errorHandler)
        this.client.ws.removeListener("message", this.messageHandler)
        if (this.resultStream.readable) {
            this.resultStream.push(null)
        }
        const unsubRequest = JSON.parse(JSON.stringify(this.request));
        unsubRequest.unsubscribe = true
        if (this.unsubscribed !== true) {
            this.client.ws.send(unsubRequest)
        }
        this.unsubscribed = true
    }

    reconnect() {
        this.stop()
        return new wsRequest(this.client, this.args)
    }
}

export default wsRequest;