import { wallet, Network, FullNode } from 'bcoin';
import anyTest, { ExecutionContext, TestInterface } from 'ava';
import { Plugin as Bpay } from './plugin';
import { WalletClient, NodeClient } from 'bclient';

const sleep = (msec: number) =>
  new Promise(resolve => setTimeout(resolve, msec));

const ADMIN_TOKEN = Buffer.alloc(32, 1).toString('hex');

const networkName = 'regtest';
const network = Network.get(networkName);
const apiKey = 'foo';

const options = {
  network: networkName,
  apiKey,
  memory: true,
  workers: true
};

const fullNode = new FullNode(options);

const bpayWalletNode = new wallet.Node({
  ...options,
  walletAuth: true,
  nodeApiKey: options.apiKey,
  adminToken: ADMIN_TOKEN,
  plugins: [Bpay]
});

interface HTTPTestContext {
  [key: string]: any;
}

const test = anyTest as TestInterface<HTTPTestContext>;

test.before('open nodes', async (t: ExecutionContext<HTTPTestContext>) => {
  await fullNode.open();
  await bpayWalletNode.open();
});

test.after('close nodes', async (t: ExecutionContext<HTTPTestContext>) => {
  await fullNode.close();
  await bpayWalletNode.close();
});

test.beforeEach(
  'prepare clients ',
  async (t: ExecutionContext<HTTPTestContext>) => {
    t.context.walletClient = new WalletClient({
      port: network.walletPort,
      apiKey,
      token: ADMIN_TOKEN
    });
    t.context.nodeClient = new NodeClient({
      port: network.port,
      apiKey
    });
  }
);

test('it should serve app', async (t: ExecutionContext<HTTPTestContext>) => {
  // tslint:disable-next-line
  console.log(fullNode.opened);
  const info = await t.context.nodeClient.getInfo();
  // tslint:disable-next-line
  console.log(info);
  t.pass();
});
