import { HTTP } from './http';

export class BPay {
  private http: HTTP;
  constructor (private node: any) {
    this.http = new HTTP();
    this.node.on()
  }

  public async open() {
    await this.http.start()
  }

  public async close () {
    this.http.close() {}
  }

  public init(node) {
    return new BPay(node);
  }
}