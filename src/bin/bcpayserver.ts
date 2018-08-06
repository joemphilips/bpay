import { Node } from 'bcoin'

const node = new Node({
  argv: true,
  config: true,
  env: true,
  listen: true,
  loader: require,
  logConsole: true,
  logFile: true,
  logLevel: 'debug',
  memory: false,
  workers: true,

  plugins: [require('../lib/plugin')]
})


(async () => {
  await node.ensure();
  await node.open();
})().catch((err) => {
  // tslint:disable-next-line no-console
  console.error(err.stack);
  process.exit(1);
});