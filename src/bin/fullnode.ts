import { ConfigOption } from 'bcfg';
import { FullNode } from 'bcoin';

export class FullNodeN extends FullNode {
  constructor(options: ConfigOption) {
    super(options);
  }
}
