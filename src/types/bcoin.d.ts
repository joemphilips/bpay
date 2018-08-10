// Type definitions for bcoin 1.0.2
// Project: https://github.com/bcoin-org/bweb
// Definitions by: Joe Miyamoto <joemphilips@gmail.com>

declare module 'bcoin' {
  import { EventEmitter } from 'events';
  import Logger from 'blgr';
  import * as bweb from 'bweb';
  import { DB, Batch } from 'bdb';
  import { Lock } from 'bmutex';
  import Config, { ConfigOption } from 'bcfg';
  export interface BcoinPlugin {
    init(): BcoinPlugin;
    open(): Promise<void>;
    close(): Promise<void>;
  }
  /**
   * Fee rate per kilobyte/satoshi.
   */
  type Rate = number;
  export namespace blockchain {
    export class Chain {}
    export class ChainEntry {}
  }

  export type Chain = blockchain.Chain;
  export type ChainEntry = blockchain.ChainEntry;

  export namespace btc {
    export class Amount {}

    export class URI {}
  }

  export type Amount = btc.Amount;

  export type URI = btc.URI;

  export namespace coins {
    export class Coins {}

    export class CoinEntry {}

    export class CoinView {}
  }

  export type Coins = coins.Coins;
  export type CoinEntry = coins.CoinEntry;
  export type CoinView = coins.CoinView;

  export namespace hd {
    export class HDPrivateKey {}

    export class HDPublicKey {}

    export class Mnemonic {}

    export interface MnemonicOptions {
      bits: number;
      language: string;
      phrase: string;
      entropy: Buffer;
    }
  }

  export type HDPrivateKey = hd.HDPrivateKey;

  export type HDPublicKey = hd.HDPublicKey;

  export type Mnemonic = hd.Mnemonic;

  export namespace mempool {
    export class Fees {}

    export class Mempool {}

    export class MempoolEntry {}
  }

  export type Fees = mempool.Fees;

  export type Mempool = mempool.Mempool;

  export type MempoolEntry = mempool.MempoolEntry;

  export namespace mining {
    export class Miner {}
  }

  export type Miner = mining.Miner;

  export namespace net {
    export interface packets {}
    export class Peer {}

    export class Pool {}
  }

  export type packets = net.packets;

  export type Peer = net.Peer;

  export type Pool = net.Pool;

  export namespace node {
    export class Node extends EventEmitter {
      network: NetworkType;
      /**
       * if use memorydb or not. default to true.
       */
      memory: boolean;
      starttime: number;
      stack: Array<any>;
      spv: boolean;
      chain?: blockchain.Chain;
      fees?: Fees;
      mempool?: Mempool;
      pool?: Pool;
      miner?: Miner;
      plugins?: Array<BcoinPlugin>;
      logger?: Logger;
      workers: WorkerPool;
      http?: bweb.Server;
      constructor(
        module: string,
        config?: Config,
        file?: string,
        options?: ConfigOption
      );
      location(name: string): string;
      /**
       * Call this in the first line of `open()`
       */
      public handlePreOpen(): Promise<void>;
      /**
       * Call this in the last line of `open()`
       */
      public handleOpen(): Promise<void>;

      /**
       * Call this in the last line of `close()`
       */
      public handleLose(): Promise<void>;
      use(plugin: BcoinPlugin): void;
      has(name: string): boolean;
      get(name: string): BcoinPlugin;
    }
    export class FullNode extends Node {
      constructor(options: ConfigOption);
      [key: string]: any;
    }

    export class SPVNode {}
  }

  export class Node extends node.Node {}

  export class FullNode extends node.FullNode {
    constructor(options: ConfigOption);
  }

  export class SPVNode extends node.SPVNode {}

  export namespace primitives {
    export class Address {}
    export class Block {}

    export class Coin {}

    export class Headers {}

    export class Input {}

    export class InvItem {}

    export class KeyRing {}

    export class MerkleBlock {}

    export class MTX {}

    export type AddOutputOptions =
      | Address
      | Script
      | Output
      | { address: Address | Script | Output; value: number };

    export type OutputOptions = {
      address?: string | Address;
      value?: number;
      script?: ScriptOptions;
    };

    export type ScriptOptions =
      | Buffer
      | Opcode[]
      | { raw?: Buffer; code?: Opcode[] };

    export class Outpoint {}

    export class Output {}

    export class TX {}
  }

  export type Address = primitives.Address;
  export type Block = primitives.Block;
  export type Coin = primitives.Coin;
  export type Headers = primitives.Headers;
  export type Input = primitives.Input;
  export type InvItem = primitives.InvItem;
  export type keyRing = primitives.KeyRing;
  export type MerkleBlock = primitives.MerkleBlock;
  export type MTX = primitives.MTX;
  export type Outpoint = primitives.Outpoint;
  export type Output = primitives.Output;
  export type TX = primitives.TX;

  export namespace protocol {
    export interface consensus {}
    export class Network {}

    export interface networks {
      type: NetworkType;
    }

    export interface policy {}
  }

  export type NetworkType = 'main' | 'testnet' | 'regtest' | 'simnet';

  export type consensus = protocol.consensus;
  export type Network = protocol.Network;
  export type networks = protocol.networks;
  export type policy = protocol.policy;
  export namespace script {
    export class Opcode {}

    export class Program {}

    export class Script {}

    export class ScriptNum {}

    export class SigCache {}

    export class Stack {}

    export class Witness {}
  }

  export type Opcode = script.Opcode;

  export type Program = script.Program;

  export type Script = script.Script;
  export type ScriptNum = script.ScriptNum;

  export type SigCache = script.SigCache;
  export type Stack = script.Stack;
  export type Witness = script.Witness;

  export namespace utils {
    export interface util {}
  }

  export type util = utils.util;

  // ------------ wallet ------------

  namespace wallet {
    type WID = number;
    type Passphrase = Buffer | string;
    type Base58String = string;
    export class Wallet extends EventEmitter {
      public wdb: WalletDB;
      public db: DB;
      public network: Network;
      public logger: Logger;
      public wid: WID;
      public id: string;
      public watchOnly: boolean;
      public accountDepth: number;
      public token: Buffer;
      public tokenDepth: number;
      /**
       *
       */
      public master: MasterKey;
      public txdb: TXDB;
      private writeLock: Lock;
      private fundLock: Lock;
      static fromOptions(
        wdb: WalletDB,
        options?: Partial<WalletOptions>
      ): Wallet;
      constructor(wdb: WalletDB, options?: Partial<WalletOptions>);
      public init(
        options: AccountOptions,
        passphrase: Passphrase
      ): Promise<void>;
      public open(): Promise<void>;
      /**
       * erase the wallet completely from db
       */
      public destroy(): Promise<void>;

      public addSharedKey(
        acct: number | string,
        key: HDPublicKey
      ): Promise<boolean>;

      public removeSharedKey(
        acct: number | string,
        key: HDPublicKey
      ): Promise<boolean>;

      public setPassphrase(
        passphrase: Passphrase,
        old: Passphrase
      ): Promise<void>;

      public encrypt(passphrase: Passphrase): Promise<void>;
      public decrypt(passphrase: Passphrase): Promise<void>;
      public retoken(passphrase: Passphrase): Promise<Buffer>;
      /**
       * Change wallet id
       * @param id - new id
       */
      public rename(id: string): Promise<void>;
      public renameAccount(acct: Account, name: string): Promise<void>;
      /**
       * Lock the wallet. delete decrypted key from memory.
       * Usually, there is no need to call this manually since
       * it will be deleted when timeout (default 60)
       */
      public lock(): Promise<void>;
      /**
       * unlock the wallet for use
       * @param passphrase
       * @param timeout - Default is 60
       */
      public unlock(passphrase: Passphrase, timeout: number);
      /**
       * Wallet id is represented as HASH160(m/44->public|magic)
       * and translated as `address` with a prefix `0x03be04
       * (`WLT` in base58)`
       */
      private getID(): Base58String;
      private getToken(nonce: number);

      public createAccount(
        options: AccountOptions,
        passphrase: Passphrase
      ): Promise<Account>;

      /**
       * if it already has an account with the name `options.name`, returns that.
       * Otherwise create new account with that name.
       * @param options
       * @param passphrase
       */
      public ensureAccount(
        options: AccountOptions,
        passphrase: Passphrase
      ): Promise<Account>;

      /**
       * Returns all account in this wallet.
       */
      public getAccounts(): Promise<Account>;

      /**
       * Used for retrieving privkey associated to the address
       * by this.getPrivateKey
       * @param acct - account name or index
       */
      public getAddressHashes(acct?: string | number): Promise<Buffer[] | null>;

      public getAccountHashes(acct: string | number): Promise<Buffer[] | null>;

      public getAccount(acct: number | string): Promise<Account | null>;

      /**
       * if argument is a number, than returns that. otherwise converts to number
       * returns -1 when not found.
       * @param acct
       */
      public getAccountIndex(acct: string): Promise<number>;
      /**
       * Opposite of `getAccountIndex`
       * @param acct
       */
      public getAccountName(acct: number): Promise<string>;

      /**
       * if argument is a number, than returns that. otherwise converts to number
       * throws error when not found.
       * @param acct
       */
      public ensureIndex(acct: string | number): Promise<number>;

      public hasAccount(acct: string | number): Promise<boolean>;

      /**
       * get key for receiving address
       * @param acct - defaults to `0`
       */
      public createReceive(acct?: string | number): Promise<WalletKey>;

      /**
       * get key for change address
       * @param acct - defaults to `0`
       */
      public createChange(acct?: string | number): Promise<WalletKey>;

      /**
       * get key with incrementing HD path depth.
       * @param acct - defaults to `0`
       */
      public createNested(acct?: string | number): Promise<WalletKey>;

      /**
       * create a new address (incremetns depth)
       * @param acct
       * @param branch
       */
      public createKey(
        acct: number | string | null,
        branch: number
      ): Promise<WalletKey>;

      /**
       * save this wallet to a database
       * @param b
       */
      public save(b: Batch): Promise<void>;

      /**
       * increment this wallet's wid in db
       * @param b
       */
      public increment(b: Batch): Promise<void>;

      /**
       * test if the wallet has an address or not.
       * @param address
       */
      public hasAddress(address: Address | Buffer): Promise<boolean>;

      /**
       * get path for deriving the key for spending the address
       * @param address - address you own
       */
      public getPath(address: Address | Buffer): Promise<Path | null>;
      private readPath(address: Address | Buffer): Promise<Path | null>;
      public hasPath(address: Address | Buffer): Promise<boolean>;
      public getPaths(acct?: string | number): Promise<boolean>;
      public getAccountPaths(acct: string | number): Promise<Path[]>;

      /**
       * Import a keyring.
       * It will not exist on derivation chain.
       * @param acct
       */
      public importKey(
        acct: string | number,
        ring: WalletKey,
        passphrase?: Passphrase
      ): Promise<void>;

      /**
       * throws an error when...
       * - This wallet is not watchOnly.
       * - It has been imported already.
       * @param acct
       * @param adddress
       */
      public importAddress(
        acct: string | number,
        adddress: Address
      ): Promise<void>;

      public fund(mtx: MTX, options?: FundOptions, force?: boolean);
      public getAccountByAddress(
        address: Address | string | Buffer
      ): Promise<Account>;

      /**
       * Input size estimator for max possible tx size
       * used for passing to `mtx.fund`
       * @param prev - previous scriptPubKey
       */
      private estimateSize(prev: Script): Promise<number>;

      /**
       * Build a transaction, fill it with outputs and inputs,
       * sort the members according to BIP69
       * @param options
       */
      public createTX(options?: createTXOptions, force?: boolean): Promise<MTX>;

      /**
       * Create tx and broadcast
       * @param options
       * @param passphrase
       */
      public send(options?: createTXOptions, passphrase?: Passphrase);

      /**
       * Intentionally double-spend by increasing fee for an existing output
       * @param hash - txid
       * @param rate
       */
      public increaseFee(
        hash: Buffer,
        rate: Rate,
        passphrase?: Passphrase
      ): Promise<primitives.TX>;

      /**
       * resend all pending wallet tx
       */
      public resend(): Promise<TX[]>;

      /**
       * derive necessary keys for signing a transaction
       * @param mtx
       */
      public deriveInputs(mtx: primitives.MTX): Promise<WalletKey[]>;

      /**
       * get keyring associated to the address
       * may not hold private key.
       * @param address
       */
      public getKey(address: Address | Buffer): Promise<WalletKey | null>;

      /**
       * get keyring associated to (mostly for spending from) the address.
       * @param address
       * @param passphrase
       */
      public getPrivateKey(
        address: Address | Buffer,
        passphrase: Buffer | string
      ): Promise<WalletKey | null>;

      /**
       * Used in deriveInputs to get associated path for mtx inputs
       * @param mtx
       */
      private getInputPaths(mtx: MTX): Promise<Path[]>;

      /**
       * Not used currently.
       * @param tx
       */
      public getOutputPaths(tx: primitives.TX): Promise<Path[]>;

      /**
       * increase lookahead for account.
       * @param acct
       * @param lookahead
       * @param
       * @param number
       */
      public setLookahead(
        acct: number | string,
        lookahead: number
      ): Promise<void>;

      /** Sync address depths based on a transaciton's outputs */
      private syncOutputDepth(tx: primitives.TX): Promise<WalletKey[]>;

      /**
       * build input scripts (or witness)
       * leave alone if the input is not redeemable by this wallet.
       * @param mtx
       * @returns Promise<number> - total number of scripts build
       */
      public template(mtx: MTX): Promise<number>;
      public sign(mtx: MTX, passphrase?: Passphrase): Promise<number>;

      // -------- below are all proxy for the methods from `TXDB` ------

      public getCoinView(tx): Promise<CoinView>;
      public getSpentView(tx: TX): Promise<CoinView>;

      public toDetails(wtx: TXRecord): Promise<Details>;
      /**
       * retrive tx from txdb before calling `toDetails`
       * @param hash
       */
      public getDetails(hash: Buffer): Promise<Details>;
      public getCoin(hash: Buffer, index: number): Promise<Coin>;
      public getTX(hash: Buffer): Promise<TX>;
      public getBlocks(hash: Buffer): Promise<BlockRecord>;
      /**
       * add transaction to the wallets TX history
       * @param tx
       * @param block
       */
      public add(tx: TX, block: BlockMeta);

      /**
       * revert wallet state to `height`
       * @param height
       */
      public revert(height: number): Promise<void>;

      public remove(hash: Buffer): Promise<void>;

      /**
       * zap pending transactions older than `age`
       * @param acct
       * @param age
       * @returns Buffer - txid of zapped tx
       */
      public zap(acct?: number | string, age?: number): Promise<Buffer>;

      public abandon(hash: Buffer): Promise<any>;

      public lockCoin(
        coin: primitives.Coin | primitives.Outpoint
      ): Promise<void>;

      public unLockCoin(
        coin: primitives.Coin | primitives.Outpoint
      ): Promise<void>;

      public isLocked(
        coin: primitives.Coin | primitives.Outpoint
      ): Promise<void>;

      /**
       * get all locked outpoints
       */
      public getLocked(): Promise<Outpoint[]>;

      /**
       * Get all transactions in transaction history.
       * @param acct
       */
      public getHistory(acct?: string | number): Promise<TX>;

      /**
       * get all available coins
       * @param acct
       */
      public getCoins(acct?: string | number): Promise<Coin[]>;

      public getCredits(acct?: string | number): Promise<Credit[]>;

      public getSmartCoins(acct?: string | number): Promise<Coin[]>;

      public getPending(acct?: string | number): Promise<TX[]>;

      public getBalance(acct?: string | number): Promise<Balance>;

      /**
       * get range of txs between two timestamps
       * @param acct
       */
      public getRange(
        acct: string | number | null,
        options: { start: number; end: number }
      ): Promise<TX[]>;

      /**
       * Get last N transactions
       * @param acct
       * @param limit
       */
      public getLast(
        acct: string | number | null,
        limit: number
      ): Promise<TX[]>;

      public accountKey(acct?: string | number): Promise<HDPublicKey>;

      public inspect(): {
        id: string;
        wid: WID;
        network: NetworkType;
        accountDepth: number;
        token: string;
        master: MasterKey;
      };

      public toJSON(
        unsafe?: Boolean
      ): {
        network: NetworkType;
        wid: WID;
        id: string;
        watchOnly: boolean;
        accountDepth: number;
        token: string;
        tokenDepth: number;
        master: MasterKey;
        balance: BalanceJSON;
      };

      public getSize(): number;

      public toRaw(): Buffer;

      private fromRaw(data: Buffer): Wallet;

      private static fromRaw(wdb: WalletDB, data: Buffer): Wallet;

      public static isWallet(obj: object): boolean;
    }

    interface Balance {
      toJSON(): BalanceJSON;
    }

    interface BalanceJSON {}

    interface TXRecord {}
    interface BlockRecord {}

    interface BlockMeta {}
    interface Details {}

    interface Credit {}

    export interface FundOptions {
      /**
       * If no account has specified, coins from entire wallet will be selected
       */
      account?: string | number;
      /**
       * coin selection algorithm. Defaults to `"age"`.
       */
      selection?: 'age' | 'random' | 'all';
      /**
       * whether to round to the nearest kilobyte for fee calculation.
       */
      round?: boolean;
      /**
       * Rate used for fee calculation.
       * estimates automatically when not specified
       */
      rate?: Rate;
      /**
       * Whether to select from coins unconfirmed or not.
       * default: false
       */
      smart?: boolean;
      /**
       * Do not apply fee if the transaction priority is high enough to be considered free.
       */
      free?: boolean;
      /**
       * Use a hard fee  rather than calculating one
       */
      hardFee: Amount;
      /**
       * Wheter to subtract the fee from existing outputs rather than adding more inputs.
       */
      subtractFee: number | boolean;
    }

    export type createTXOptions = FundOptions & {
      outputs?: primitives.OutputOptions[];
      sort?: boolean;
      locktime?: number;
    };

    export interface WalletOptions {
      master: MasterKey | string;
      mnemonic: Partial<hd.MnemonicOptions>;
      wid: WID;
      id: string;
      watchOnly: boolean;
      accountDepth: number;
      token: Buffer;
      tokenDepth: number;
    }
    export class TXDB {}
    export class MasterKey {}
    export class Account {
      constructor(wdb: WalletDB, options: AccountOptions);
    }
    interface AccountOptions {
      wid: number;
      accountIndex: number;
      name?: string;
      initialized?: boolean;
      witness?: boolean;
      watchOnly?: boolean;
      type?: string | number;
      m?: number;
      n?: number;
      receiveDepth?: number;
      changeDepth?: number;
      nestedDepth?: number;
      lookahead?: number;
      accountKey?: HDPublicKey;
    }
    export class WalletKey {}
    export class Path {}
    export class WalletDB {}

    /**
     * type emitted by walletdb
     */
    export type WalletDBEvent = 'address';
    export type WalletEvent = 'address';
  }

  export type Wallet = wallet.Wallet;

  export type Path = wallet.Path;
  export type WalletKey = wallet.WalletKey;
  export type WalletDB = wallet.WalletDB;

  /// ------ worker ------

  export namespace workers {
    export class WorkerPool {}
  }

  export type WorkerPool = workers.WorkerPool;

  export interface pkg {
    readonly version: string;
    readonly url: string;
  }
}
