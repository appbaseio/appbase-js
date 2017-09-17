import stringify from "json-stable-stringify";
import { validate, btoa } from "../helpers";

class addWebhookService {
    constructor(client, args, webhook) {
        let valid = validate(args, {
            "body": "object"
        });
        if(valid !== true) {
            throw valid
        }

        if(args.type === undefined || !(typeof args.type === "string" || args.type.constructor === Array)
            || (args.type === "" || args.type.length === 0) ) {
            throw new Error("fields missing: type")
        }

        valid = validate(args.body, {
            "query": "object"
        })
        if(valid !== true) {
            throw valid
        }

        if(args.type.constructor === Array) {
            this.type = args.type
            this.type_string = args.type.join()
        } else {
            this.type = [args.type]
            this.type_string = args.type
        }

        this.webhooks = []
        this.client = client
        this.query = args.body.query

        if(typeof webhook === "string") {
            const webhook_obj = {};
            webhook_obj.url = webhook
            webhook_obj.method = "GET"
            this.webhooks.push(webhook_obj)
        } else if(webhook.constructor === Array) {
            this.webhooks = webhook
        } else if(webhook === Object(webhook)) {
            this.webhooks.push(webhook)
        } else {
            throw new Error("fields missing: second argument(webhook) is necessary")
        }

        this.populateBody()

        const encode64 = btoa(stringify(this.query));
        const path = `.percolator/webhooks-0-${this.type_string}-0-${encode64}`;

        this.path = path

        return this.performRequest("POST") 
    }

    populateBody() {
        this.body = {}
        this.body.webhooks = this.webhooks
        this.body.query = this.query
        this.body.type = this.type
    }

    performRequest(method) {
        const res = this.client.performWsRequest({
            method,
            path: this.path,
            body: this.body
        });

        res.change = this.change.bind(this)
        res.stop = this.stop.bind(this)

        return res
    }

    change(args) {
        this.webhooks = []

        if(typeof args === "string") {
            const webhook = {};
            webhook.url = args
            webhook.method = "POST"
            this.webhooks.push(webhook)
        } else if(args.constructor === Array) {
            this.webhooks = args
        } else if(args === Object(args)) {
            this.webhooks.push(args)
        } else {
            throw new Error("fields missing: one of webhook or url fields is required")
            return
        }

        this.populateBody()

        return this.performRequest("POST")
    }

    stop() {
        delete this.body

        return this.performRequest("DELETE")
    }
}

export default addWebhookService;
