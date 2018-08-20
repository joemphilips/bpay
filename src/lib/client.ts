import { WalletClient, BclientOption } from 'bclient';

export class BPayClient extends WalletClient {
  public static path = '/bpay';
  constructor(options: BPayClientOptions) {
    super(options);
  }

  public async open() {
    await super.open();
  }
}

export interface BPayClientOptions extends BclientOption {
  [key: string]: any;
}
