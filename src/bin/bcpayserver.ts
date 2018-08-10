import { Plugin } from '../lib/plugin';
import { FullNodeN as FullNode } from './fullnode';

const node = new FullNode({
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
  await node.connect();
  await node.startSync();
})().catch(err => {
  // tslint:disable-next-line no-console
  console.error(err.stack);
  process.exit(1);
});
