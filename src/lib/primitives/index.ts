export type BillStatus = 'draft' | 'sent' | 'payed' | 'complete';
export interface Item {
  description: string;
  price: number;
  quentity: number;
}

export class Bill {
  public id: string;
  public token: string;
  public createdDate: Date;
  public delivered: boolean;
  public number: string;
  public status: BillStatus;
  public currency: string;
  public showRate: boolean;
  public archived: boolean;
  public name: string;
  public address1: string;
  public address2: string;
  public city: string;
  public state: string;
  public zip: string;
  public countery: string;
  public email: string;
  public phone: string;
  public dueDate: Date;
  public Items: ReadonlyArray<Item>;
  public passProcessingFee: number;
}
