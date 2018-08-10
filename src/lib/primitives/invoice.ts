import bsert from 'bsert';
// import { Struct } from 'bufio';

export type BaseState =
  | 'new'
  | 'paid'
  | 'confirmed'
  | 'complete'
  | 'expired'
  | 'invalid';

export type ExceptionState = 'false' | 'paidPartial' | 'paidOver';

export type InvoiceOption = Partial<Invoice> &
  Pick<Invoice, 'id' | 'token' | 'price'>;

// tslint:disable:member-access
export class Invoice /*extends Struct*/ {
  static fromOptions(options) {
    return new this(options);
  }
  baseState: BaseState;
  exceptionState: ExceptionState;
  id: string;
  token: string;
  price: number;
  /**
   * ISO 4217 3-character currency code.
   */
  currency: string;
  /**
   * ID used by merchant to assign their own internal id to an invoice.
   */
  orderId: string;
  /**
   * Description of the invoice.
   */
  itemDesc: string;
  /**
   * @deprecated
   * `bitcoindonation` for donation. otherwise null
   */
  itemCode: string;
  notificationEmail: string;
  notificationURL: string;
  redirectURL: string;
  posData: string;
  constructor({ token, id, price, ...options }: InvoiceOption) {
    // super();
    this.token = token;
    this.id = id;
    this.price = price;
    if (options) {
      this.fromOptions(options);
    }
    return this;
  }

  public fromOptions(options) {
    if (options.token) {
      this.token = options.token;
    }
    return this;
  }

  public fromJSON(json: object) {
    bsert(json, 'json must not be ');
    return this;
  }
  public getJSON() {
    return {
      id: this.id,
      token: this.token
    };
  }
  public fromString(data: string) {
    return '';
  }
}
