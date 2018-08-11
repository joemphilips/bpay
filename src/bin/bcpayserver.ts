import { Plugin } from '../lib/plugin';
import { BPayWalletNode } from './walletnode';
// tslint:disable no-console no-var-requires

if (
  process.argv.indexOf('--help') !== -1 ||
  process.argv.indexOf('-h') !== -1
) {
  console.error('help document is not ready yet ... ');
  process.exit(1);
  throw new Error('Could not exit.');
}

if (
  process.argv.indexOf('--version') !== -1 ||
  process.argv.indexOf('-v') !== -1
) {
  const pkg = require('../../package.json');
  console.log(`bpay ${pkg.version}`);
  process.exit(0);
  throw new Error('Could not exit.');
}

const node = new BPayWalletNode({
  argv: true,
  config: true,
  env: true,
  listen: true,
  loader: require,
  logConsole: true,
  logFile: true,
  logLevel: 'debug',
  memory: false,
  workers: true
});

node.use(Plugin);

(async () => {
  await node.ensure();
  await node.open();
})().catch(err => {
  // tslint:disable-next-line no-console
  console.error(err.stack);
  process.exit(1);
});
