import Logger from 'blgr';
import { Server } from 'bweb';
import * as path from 'path';
import { setRoute } from './routes';

export class HTTP extends Server {
  public invoicedb;
  private log: Logger;
  constructor(options) {
    super();
    this.log = new Logger(options.loglevel);
    this.invoicedb = options.invoicedb;
    this.init();
  }

  public async close() {
    await this.invoicedb.close();
  }

  private init() {
    this.on('request', (req, res) => {
      this.log.debug(
        'Request for method=%s path=%s (%s).',
        req.method,
        req.pathname,
        req.socket.remoteAddress
      );
    });

    this.on('listening', address => {
      this.log.info(
        'bpay HTTP server listening on %s (port=%d).',
        address.address,
        address.port
      );
    });

    this.use(this.router());
    this.use(this.bodyParser());
    this.use('/app', this.fileServer(path.join(__dirname, './frontend')));
    this.initRouter();
    // this.initSockets();
    this.initApp();
  }

  private initRouter() {
    // setRoute(this);
    this.log.warning('not implemented');
  }

  // private initSockets() {}
  private initApp() {
    const appDir = './frontend';
    this.use('$/^', this.fileServer(appDir));
  }
}
