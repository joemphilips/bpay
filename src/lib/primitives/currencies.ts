export enum supportedCurrency {
  USD,
  EUR,
  BTC
}

export interface Currency {
  readonly code: supportedCurrency;
  readonly symbol: string;
  readonly precision: number;
  readonly exchangePctFee: number;
  readonly payoutEnabled: boolean;
  readonly name: string;
  readonly plural: string;
  readonly alts: string;
  readonly minimum: number;
  readonly payoutFields: ReadonlyArray<any>;
}
