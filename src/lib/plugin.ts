import { Node } from 'bcoin';
import { EventEmitter } from 'events';
import { HTTP } from './http';
import { InvoiceDB } from './invoicedb';

export class Plugin extends EventEmitter {
  public static id = 'bpay';
  public static subpath = '/bpay';
  public static init(node: Node) {
    return new Plugin(node);
  }

  public http;
  public invoicedb;
  constructor(public node: Node) {
    super();
    this.invoicedb = new InvoiceDB();
    this.http = new HTTP({ invoicedb: this.invoicedb });
  }

  public async open() {
    if (this.node.http) {
      this.http.attach(Plugin.subpath, this.http);
    }
    await this.http.open();
  }
  public async close() {
    await this.invoicedb.close();
    await this.http.close();
  }
}
