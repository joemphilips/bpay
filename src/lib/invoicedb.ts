import Logger from 'blgr';
import * as bdb from 'bdb';
import { invoicedb as layout } from './layout';

export class InvoiceDB {
  public logger: Logger;
  public db: bdb.DB;
  constructor(options: InvoiceDBOptions) {
    this.logger =
      options.logger.context('invoicedb') || new Logger().context('invoicedb');
    this.db = bdb.create(options);
  }

  public async open() {
    this.logger.info('Opening Invoice DB ...');
    await this.db.open();
    await this.db.verify(layout.V.build(), 'invoice', 4);
  }

  public async close() {
    await this.db.close();
  }
}

export type InvoiceDBOptions = Partial<{
  logger: Logger;
  prefix: string;
  memory: boolean;
}>;
