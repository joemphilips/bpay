import Logger from 'blgr';

export class InvoiceDB {
  public logger: Logger;
  constructor(options: InvoiceDBOptions) {
    this.logger =
      options.logger.context('invoicedb') || new Logger().context('invoicedb');
  }
}

export type InvoiceDBOptions = Partial<{
  logger: Logger;
  prefix: string;
  memory: boolean;
}>;
