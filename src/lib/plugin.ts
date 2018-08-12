import { Node } from 'bcoin';
import Logger from 'blgr';
import { EventEmitter } from 'events';
import { HTTP } from './http';
import { InvoiceDB } from './invoicedb';
import Config from 'bcfg';

export class Plugin extends EventEmitter {
  public static id = 'bpay';
  public static subpath = '/bpay';
  public static init(node: Node) {
    return new Plugin(node);
  }

  public logger: Logger;
  public http;
  public invoicedb;
  public config: Config;
  constructor(public node: Node) {
    super();
    this.config = node.config.filter('bpay');

    // ---- logger ----
    this.logger = new Logger().context(Plugin.id);
    if (process.env.NODE_ENV === 'development') {
      this.logger.setLevel('debug');
    }
    this.logger.open();

    // ---- invoicedb ----
    this.invoicedb = new InvoiceDB({
      logger: this.logger,
      prefix: this.config.prefix,
      memory: this.config.bool('memory', node.memory)
    });

    // ---- http ----
    const httpOptions = node.http.options;
    this.http = new HTTP({
      invoicedb: this.invoicedb,
      logger: this.logger,
      ...httpOptions
    });
    this.logger.debug('bpay plugin initialized!');
  }

  public async open() {
    if (this.node.http) {
      this.http.attach(Plugin.subpath, this.node.http);
    }
    await this.http.open();
    this.logger.debug('bpay plugin opened!');
  }
  public async close() {
    await this.invoicedb.close();
    await this.http.close();
  }
}
