import { WalletClient, BclientOption } from 'bclient';

export class BPayClient extends WalletClient {
  constructor(options: BPayClientOptions) {
    super(options);
  }
}

export interface BPayClientOptions extends BclientOption {
  [key: string]: any;
}
