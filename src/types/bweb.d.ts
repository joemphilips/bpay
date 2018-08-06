// Type definitions for bweb 0.1.3
// Project: https://github.com/bcoin-org/bweb
// Definitions by: Joe Miyamoto <joemphilips@gmail.com>

// tslint:disable:no-method-signature

declare module 'bweb' {
  import http from 'http';
  import https from 'https';
  import bsock from 'bsock';
  export abstract class Server {
    public http: http.Server | https.Server;
    public io: bsock.Server;
    public rpc: RPC;
    public routes: Router;
    constructor(options?: ServerOptions);
    get(path: string, cb: any);
    post(path: string, cb: any);
    put(path: string, cb: any);
    on();
    /**
     * Optional Abstract Method, it needs to be implemented only when
     * you want to handle a websocket.
     * @param socket
     */
    handleSocket(socket: bsock.Socket): void;
    /**
     * Optional Abstract Method. It needs to be implmented only when
     * you want to handle a websocket
     */
    handleCall(): void;
    open(): Promise<void>;
    close(): Promise<void>;
    /**
     * setup onError handler
     */
    error(handler: Function): void;
  }
  export type ServerOptions = Partial<{
    host: string;
    port: number;
    ssl: boolean;
    keyFile: string;
    certFile: string;
    key: string;
    cert: string;
    ca: Array<any>;
    sockets: boolean;
  }>;

  export function createServer(options?: ServerOptions): Server;
  export function server(options?: ServerOptions): Server;
  export class Router {}
  export function router(): Router;
  export class RPC {}
  export function rpc(): RPC;
  export class RPCError {}
  export function errors() {}
  export interface middleware {
    basicAuth: any;
    bodyParser: any;
    cookieParser: any;
    cors: any;
    fileServer: any;
    jsonRPC: any;
    router: any;
  }
}
