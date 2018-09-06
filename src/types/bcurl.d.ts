// Type definitions for bcurl 0.1.2
// Project: https://github.com/bcoin-org/bcoin
// Definitions by: Joe Miyamoto <joemphilips@gmail.com>
declare module 'bcurl' {
  import { Socket } from 'bsock';
  export class Client {
    ssl: boolean;
    host: string;
    port: number;
    path: string;
    username?: string;
    password?: string;
    id?: string;
    token?: string;
    limit?: number;
    sequence: number;
    opened: boolean;
    socket: Socket;
    constructor(options: string | BCurlClientOptions);
    open(): Promise<void>;
    close(): Promise<void>;
    /**
     * Abstract method to authenticate.
     */
    auth(): Promise<void>;
    // ---- methods for socket ------
    hook(...args: any[]): any;
    call(...args: any[]): Promise<any>;
    bind(...args: any[]): any;
    fire(...args: any[]): any;
    // -----------------------------

    request(method: string, endpoint: string, params?: object): Promise<any>;
    get(endpoint: string, params?: object): Promise<any>;
    post(endpoint: string, params?: object): Promise<any>;
    put(endpoint: string, params?: object): Promise<any>;
    del(endpoint: string, params?: object): Promise<any>;
    /**
     * Make a json rpc request
     * @param endpoint
     * @param params
     */
    execute(endpoint: string, method: string, params?: object): Promise<any>;
  }

  export interface BCurlClientOptions {
    ssl?: boolean;
    host?: string;
    port?: number;
    path?: string;
    apiKey?: string;
    key?: string;
    username?: string;
    password?: string;
    url?: string;
    id?: string;
    token?: string;
    limit?: number;
  }
}
