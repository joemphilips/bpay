import { Facade } from './common';

export class PairngCode {
  constructor(
    public id: Buffer,
    public facade: Facade,
    public label: string,
    public sin: any,
    public createdTime: Date,
    public experationTime: Date
  ) {}
}
