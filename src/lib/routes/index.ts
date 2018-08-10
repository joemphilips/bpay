import * as brq from 'brq';
import bsert from 'bsert';
import { Validator } from 'bval';
// tslint:disable no-unused-expression no-empty

export const setRoute = server => {
  server.get('/:id', async (req, res) => {
    const invoice = {};
    if (req.callback) {
      brq.post({ url: req.callback, body: invoice });
    }
  });

  // ---- bitpay compliant REST API handlers ------
  server.get('/bills', async (req, res) => {});
  server.post('/bills', async (req, res) => {});
  server.get('/bills/:id', async (req, res) => {});
  server.put('/bills/:id', async (req, res) => {});
  server.post('/bills/:id/deliveries', async (req, res) => {});

  server.post('/clients', async (req, res) => {});
  server.get('/clients', async (req, res) => {});
  server.put('/clients/:id', async (req, res) => {});

  server.get('/currencies', async (req, res) => {});

  // ------ BTCPayServer compliant REST API Handlers

  /**
   * create invoice
   */
  server.get('/tokens', async (req, res) => {});
  server.post('/tokens', async (req, res) => {});

  // ------- Server settings -------
  server.get('/server/rates', async (req, res) => {});
  server.get('/server/users', async (req, res) => {});
  server.get('/server/users/:id', async (req, res) => {});
  server.get('/server/emails', async (req, res) => {});
  server.get('/server/policies', async (req, res) => {});

  // ------- Store settings -------
  server.get('/stores', async (req, res) => {});
  server.get('/stores/:id', async (req, res) => {});
  server.get('/stores/:id/token', async (req, res) => {});
  server.get('/stores/:id/wallet', async (req, res) => {});
  server.get('/stores/create', async (req, res) => {});
  server.post('/stores/create', async (req, res) => {});

  // ------- apps -------
  server.post('/apps', async (req, res) => {});

  // ------- Invoices ----------
  server.post('/invoices', async (req, res) => {
    const valid = Validator.fromRequest(req);
    const price = valid.ufloat('price');
    const currency = valid.string('currency');

    // Optional parameters
    const posData = valid.obj('posData');
    const notificationURL = valid.str('notificationURL');
    const txSpeed = valid.str('transactionSpeed');
    bsert(txSpeed === 'high' || txSpeed === 'medium' || txSpeed === 'low');
  });
  server.get('/invoices/create', async (req, res) => {});
  server.post('/invoices/create', async (req, res) => {});
  server.get('/invoices/:id', async (req, res) => {});
  server.get('/invoices/:id/events', async (req, res) => {
    const { url, token, events, action } = req;
    const result = { url, token, events, action };
    res.json(200, result);
  });
  server.post('/invoices/:id/refunds', async (req, res) => {
    const valid = Validator.fromRequest(req);
    const email = valid.str('refundEmail');
    const amount = valid.i32('amount');
  });

  // ------ manage your account ------
  server.get('/manage', async (req, res) => {});
  server.post('/manage', async (req, res) => {});
  server.get('/manage/changepassword', async (req, res) => {});
  server.get('/manage/changepassword', async (req, res) => {});
  server.post('/manage/changepassword', async (req, res) => {});
  server.get('/manage/2fa', async (req, res) => {});
  server.post('/manage/2fa', async (req, res) => {});

  server.get('/account/register', async (req, res) => {});
  server.post('/account/register', async (req, res) => {});
  server.get('/account/login', async (req, res) => {});
  server.post('/account/login', async (req, res) => {});

  server.post('/logout', async (req, res) => {});
};
