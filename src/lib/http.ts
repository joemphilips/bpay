import Logger from 'blgr';
import brq = require('brq');
import bsert = require('bsert');
import Validator = require('bval');
import bweb = require('bweb');
import Koa from 'koa';

export class HTTP extends bweb.Server {
  public app;
  public invoicedb;
  private log;
  constructor(options) {
    super();
    this.app = new Koa();
    this.log = new Logger(options.loglevel);
    this.invoicedb = options.invoicedb;
  }

  public init() {
    this.get('/:id', async (req, res) => {
      const invoice = {};
      brq.post({ url: req.callback, body: invoice });
    });

    this.get('/invoices/:id', async (req, res) => {});
    this.get('/bills', async (req, res) => {});
    this.post('/bills', async (req, res) => {});
    this.get('/bills/:id', async (req, res) => {});
    this.put('/bills/:id', async (req, res) => {});
    this.post('/bills/:id/deliveries', async (req, res) => {});

    this.post('/clients', async (req, res) => {});
    this.get('/clients', async (req, res) => {});
    this.put('/clients/:id', async (req, res) => {});

    this.get('/currencies', async (req, res) => {});

    /**
     * create invoice
     */
    this.post('/invoices', async (req, res) => {
      const valid = Validator.fromRequest(req);
      const price = valid.ufloat('price');
      const currency = valid.string('currency');

      // Optional parameters
      const posData = valid.obj('posData');
      const notificationURL = valid.str('notificationURL');
      const txSpeed = valid.str('transactionSpeed');
      bsert(txSpeed === 'high' || txSpeed === 'medium' || txSpeed === 'low');
    });
    this.get('/invoices/:id', async (req, res) => {});
    this.get('/invoices/:id/events', async (req, res) => {
      const { url, token, events, action } = handleReq(req);
      const result = { url, token, events, action };
      res.json(200, result);
    });
    this.post('/invoices/:id/refunds', async (req, res) => {
      const valid = Validator.fromRequest(req);
      const email = valid.str('refundEmail');
      const amount = valid.i32('amount');
    });
  }
  public start() {
    try {
    } catch (err) {
      this.log.error('failed to start BManager');
    }
  }
  public close() {}
}
