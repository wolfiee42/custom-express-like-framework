import { Handler, Method } from "./type";

export class TrieNode {
    path: string = '';
    isEnd: boolean = false;
    method: Method = 'GET';
    children: Map<string, TrieNode> = new Map();
    handlers: Map<Method, Handler> = new Map();
}

type MatchResult = {
    handler: Handler;
    params: Record<string, string>;
    originalPath: string;
}

export class Router {
    private root: TrieNode = new TrieNode();

    add(method: Method, path: string, handler: Handler): void {

        const segments = path.split('/').filter(Boolean);

        let node = this.root;
        for (const segment of segments) {
            if (!node.children.has(segment)) {
                const newNode = new TrieNode();
                newNode.path = segment;
                newNode.children.set(segment, newNode);
            }

            node = node.children.get(segment)!;
        }
        node.isEnd = true;
        node.method = method;
        node.handlers.set(method, handler);
    }

    match(method: Method, path: string): MatchResult | null {

        const segments = path.split('/').filter(Boolean);

        let node: TrieNode | null = this.root;
        const params: Record<string, string> = {};
        let i = 0;
        let originalPath = '';

        while (i < segments.length && node) {

            const segment = segments[i];

            // Try exact match
            if (node.children.has(segment)) {
                node = node.children.get(segment)!;
                originalPath += `/${node.path}`;
                i++;
                continue;
            }

            //  Try dynamic match
            let matched: boolean = false;
            for (const [childPath, childNode] of node.children) {
                if (childPath.startsWith(':')) {
                    params[childPath.slice(1)] = segment;
                    node = childNode;
                    originalPath += `/${node?.path}`;
                    i++;
                    matched = true;
                    break;
                }
            }

            if (!matched) {
                node = null;
                break;
            }

            if (node && node.isEnd && node.handlers.has(method)) {
                const handler = node.handlers.get(method)!;
                return {
                    handler,
                    params,
                    originalPath
                }
            }
        }
        return null;
    }

    toString(): string {

        const routes: string[] = [];
        const traverse = (node: TrieNode, path: string = '') => {
            if (node.isEnd) {
                for (const [method, handler] of node.handlers) {
                    routes.push(`${method.padEnd(6)} ${path} -> ${handler.name}`);
                }
            }

            for (const [segment, childNode] of node.children) {
                traverse(childNode, `${path}/${segment}`);
            }
        }

        traverse(this.root);
        return routes.length ? routes.join('\n') : 'No routes found.';

    }
}