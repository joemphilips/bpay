import { EventEmitter } from 'events';
import { HTTP } from './http';
import { InvoiceDB } from './invoicedb';

export class Plugin extends EventEmitter {
  public static id = 'bpay';
  public static init(node) {
    return new this(node);
  }
  public http;
  public invoicedb;
  constructor(public node) {
    super();
    this.invoicedb = new InvoiceDB();
    this.http = new HTTP({ invoicedb: this.invoicedb });
  }
  public async open() {}
  public async close() {}
}
