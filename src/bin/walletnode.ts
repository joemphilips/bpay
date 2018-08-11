import { ConfigOption } from 'bcfg';
import { wallet } from 'bcoin';

export class BPayWalletNode extends wallet.Node {
  constructor(options: ConfigOption) {
    super(options);
  }
}
