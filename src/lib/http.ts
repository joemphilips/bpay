import { wallet, Network } from 'bcoin';
import Logger from 'blgr';
import { Server } from 'bweb';
import * as fs from 'fs';
import * as path from 'path';
import { setRoute } from './routes';
import { InvoiceDB } from './invoicedb';
type WalletHTTPOptions = wallet.HTTPOptions;

export type BPayHTTPOptions = Partial<WalletHTTPOptions> & {
  invoicedb: InvoiceDB;
  logger: Logger;
};
export class HTTP extends Server {
  public invoicedb;
  public network: Network;
  private logger: Logger;
  private port: number;
  constructor(options: BPayHTTPOptions) {
    super(options);
    this.network = this.options.network;
    this.port = options.port || this.network.walletPort;
    this.logger = options.logger.context('bpay http');
    this.invoicedb = options.invoicedb;
    this.init();
  }

  private init() {
    this.on('request', (req, res) => {
      this.logger.debug(
        'Request for method=%s path=%s (%s).',
        req.method,
        req.pathname,
        req.socket.remoteAddress
      );
    });

    this.on('listening', address => {
      this.logger.info(
        'bpay HTTP server listening on %s (port=%d).',
        address.address,
        address.port
      );
    });

    this.use(this.router());
    this.use(this.bodyParser());
    this.initApp();
    this.initRouter();
    // this.initSockets();
  }

  private initRouter() {
    this.get('/_health', (req, res) => {
      res.json(200, { good: 'good' });
    });
  }

  // private initSockets() {}
  private initApp() {
    const appDir = path.join(__dirname, '../../../public/build/index.html');
    // tslint:disable no-console
    // console.log('appDir');
    // console.log(appDir);
    this.use('/app', this.fileServer(appDir));
  }
}
