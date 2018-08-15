import { wallet, Network, FullNode } from 'bcoin';
import anyTest, { ExecutionContext, TestInterface } from 'ava';
import { Plugin as Bpay } from './plugin';
import { WalletClient, NodeClient } from 'bclient';
import { ConfigOption } from 'bcfg';
import { TextDecoder } from 'util';

const sleep = (msec: number) =>
  new Promise(resolve => setTimeout(resolve, msec));

const ADMIN_TOKEN = Buffer.alloc(32, 1).toString('hex');

const networkName = 'regtest';
const network = Network.get(networkName);
const apiKey = 'foo';

const options: ConfigOption = {
  network: networkName,
  apiKey,
  memory: true,
  workers: true,
  httpHost: '::'
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
      port: network.rpcPort,
      apiKey
    });
  }
);

test('Chain node should respond by info', async (t: ExecutionContext<
  HTTPTestContext
>) => {
  const info = await t.context.nodeClient.getInfo();
  t.is(info.network, 'regtest');
});

/*
test('BPay should respond ', async (t: ExecutionContext<
  HTTPTestContext
>) => {
  const result = await t.context.
});
*/
