// Type definitions for bcoin 1.0.2
// Project: https://github.com/bcoin-org/bcoin
// Definitions by: Joe Miyamoto <joemphilips@gmail.com>

declare module 'n64' {
  import BN from 'bn.js';
  /**
   * mimics typing of `bn.js`.
   * It is likely to be replaced by EcmaScript bigint.
   * This typing is far from perfect, but does its jobs quite enough.
   */
  export class I64 extends BN {
    /**
     * Internal hi bits.
     * Internal lo bits.
     */
    hi: number;
    lo: number;
    sign: 0 | 1;
    static min(a: BN, b: BN): BN;
    static max(a: BN, b: BN): BN;
    static random(): I64;
    static pow(num: number, exp: number): BN;
    static shift(num: number, bits: number): BN;
    static readLE(data: number, offset: number): BN;
    static readBE(data: number, offset: number): BN;
    static readRaw(data: number, offset: number): BN;
    static readNumber(data: number): BN;
    static fromInt(lo: number): BN;
    static fromBits(hi: number, lo: number): BN;
    static fromObject(obj: { hi: number; lo: number }): BN;
    static fromString(str: string, base?: number): BN;
    static fromLE(data: Buffer): BN;
    static fromBE(data: Buffer): BN;
    static fromRaw(data: Buffer): BN;
    static isN64(obj: object): boolean;
    static isU64(obj: object): boolean;
    static isI64(obj: object): boolean;
  }
}
