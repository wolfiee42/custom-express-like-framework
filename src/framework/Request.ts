import { IncomingMessage } from "node:http";
import { Method, Request } from "./type"
import { parse } from "node:url";

export class RequestImpl implements Request {
    nodeReq: IncomingMessage;
    method: Method;
    headers: Record<string, string>;
    path: string; // /posts/234
    originalPath: string; // /posts/:id
    query: Record<string, string>;
    params: Record<string, string>;
    body: string | object | null;

    constructor(nodeReq: IncomingMessage) {
        this.nodeReq = nodeReq as IncomingMessage;
        this.method = nodeReq.method as Method;
        this.headers = nodeReq.headers as Record<string, string>

        const parsedUrl = parse(nodeReq.url!, true);
        this.path = parsedUrl.pathname!;
        this.query = parsedUrl.query as Record<string, string>;
        this.originalPath = '';
        this.params = {};
        this.body = null;
    }

    async parseBody() {
        const allowedMethods = ['PUT', 'PATCH', 'POST'];

        if (!allowedMethods.includes(this.method)) {
            this.body = null;
            return;
        }
    }
}