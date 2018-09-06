// Type definitions for bcoin 1.0.2
// Project: https://github.com/bcoin-org/bcoin
// Definitions by: Joe Miyamoto <joemphilips@gmail.com>
declare module 'bcoin' {
  import { BufferWriter, BufferReader } from 'bufio';
  import { BufferSet } from 'buffer-map';
  import AsyncEmitter from 'bevent';
  import { EventEmitter } from 'events';
  import Logger, { LoggerContext } from 'blgr';
  import { DB, Bucket, Batch, DBOptions } from 'bdb';
  import { Lock } from 'bmutex';
  import { ConfigOption } from 'bcfg';
  import * as bweb from 'bweb';
  import * as bclient from 'bclient';
  import { BloomFilter } from 'bfilter';
  import { MapLock } from 'bmutex';

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
        options?: Partial<WalletArgument>
      ): Wallet;
      constructor(wdb: WalletDB, options?: Partial<WalletArgument>);
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
      public unlock(
        passphrase: Passphrase,
        timeout: number
      ): Promise<HDPrivateKey>;
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
       * create a new address (increments depth)
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
       * @param address
       */
      public importAddress(
        acct: string | number,
        address: Address
      ): Promise<void>;

      public fund(
        mtx: MTX,
        options?: FundOptions,
        force?: boolean
      ): Promise<void>;
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
      public send(
        options?: createTXOptions,
        passphrase?: Passphrase
      ): Promise<TX>;

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

      /** Sync address depths based on a transaction's outputs */
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

      public getCoinView(tx: TX): Promise<CoinView>;
      public getSpentView(tx: TX): Promise<CoinView>;

      public toDetails(wtx: records.TXRecord): Promise<Details>;
      /**
       * retrieve tx from txdb before calling `toDetails`
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
      public add(tx: TX, block: records.BlockMeta): Promise<Details>;

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
       * get all coins
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

    class Balance {
      account: number;
      tx: number;
      coin: number;
      unconfirmed: number;
      confirmed: number;
      constructor(acct?: number);
      /**
       * Apply delta
       * @param balance - the balance which will be merged to `this`
       */
      applyTo(balance: Balance): void;
      toRaw(): Buffer;
      static fromRaw(acct?: number, data?: Buffer): Balance;
      toJSON(minimal?: boolean): BalanceJSON;
      inspect(): string;
    }

    interface BalanceJSON {
      account?: number | void;
      tx: number;
      coin: number;
      unconfirmed: number;
      confirmed: number;
    }

    class BalanceDelta {
      wallet: Balance;
      accounts: Map<Path, Account>;
      constructor();
      updated(): boolean;
      applyTo(balance: Balance): void;
      get(path: Path): Account;
      tx(path: Path, value: number): void;
      coin(path: Path, value: number): void;
      unconfirmed(path: Path, value: number): void;
      confirmed(path: Path, value: number): void;
    }

    /**
     * Transaction Details.
     * Much like TXMeta
     */
    class Details {
      hash: Buffer;
      tx: TX;
      mtime: number;
      size: number;
      vsize: number;
      block?: Buffer;
      height: number;
      time: number;
      inputs: DetailsMember[];
      outputs: DetailsMember[];
      constructor(wtx: records.TXRecord, block?: records.BlockMeta);
      setInput(i: number, path: Path, coin: Coin): void;
      setOutput(i: number, path: Path): void;
      getDepth(height?: number): number;
      /**
       * Calculate fee. Only works if wallet owns all inputs.
       * Returns 0 otherwise.
       */
      getFee(): number;
      /**
       * Calculate fee rate
       * @param fee
       */
      getRate(fee?: number): Rate;
      toJSON(network?: NetworkType | Network): object;
    }
    interface DetailsJson {
      hash: string;
      height: number;
      block?: string;
      time: number;
      mtime: number;
      date: number;
      mdate: number;
      size: number;
      virtualSize: number;
      fee: number;
      rate: Rate;
      confirmations: number;
      inputs: DetailsMemberJson[];
      outputs: DetailsMemberJson[];
      tx: string;
    }
    class DetailsMember {
      value: number;
      address?: string;
      toJSON(): DetailsMemberJson;
      getJSON(network?: NetworkType | Network): DetailsMemberJson;
    }

    interface DetailsMemberJson {
      value: number;
      address?: string;
      path?: string;
    }

    class BlockRecord {
      hash: Buffer;
      height: number;
      time: number;
      constructor(hash?: Buffer, height?: number, time?: number);
      hashes: BufferSet<Buffer>;
      add(hash: Buffer): boolean;
      remove(hash: Buffer): void;
      static fromRaw(data: Buffer): BlockRecord;
      getSize(): number;
      toRaw(): Buffer;
      toArray(): Buffer[];
      toJSON(): BlockRecordJson;
      static fromMeta(block: records.BlockMeta): BlockRecord;
    }
    interface BlockRecordJson {
      hash: string;
      height: number;
      time: number;
      hashes: string[];
    }

    class Credit {
      coin: Coin;
      own: boolean;
      spent: boolean;
      constructor(coin?: Coin, spent?: boolean);
      static fromRaw(data: Buffer): Credit;
      getSize(): number;
      toRaw(): Buffer;
      static fromTX(tx: TX, index: number, height: number): Credit;
    }

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
      hardFee: btc.AmountValue;
      /**
       * Whether to subtract the fee from existing outputs rather than adding more inputs.
       */
      subtractFee: number | boolean;
    }

    export type createTXOptions = FundOptions & {
      outputs?: primitives.OutputOptions[];
      sort?: boolean;
      locktime?: number;
    };

    export interface WalletArgument {
      master: MasterKey | string;
      mnemonic: Partial<hd.MnemonicOptions>;
      wid: WID;
      id: string;
      watchOnly: boolean;
      accountDepth: number;
      token: Buffer;
      tokenDepth: number;
    }

    /**
     * defined as `WalletNode` internally.
     */
    export class Node extends node.Node {
      public opened: boolean;
      public client: Client;
      public wdb: WalletDB;
      public rpc: RPC;
      public http: HTTP;
      constructor(options?: ConfigOption);
      public open(): Promise<void>;
      public close(): Promise<void>;
    }

    export class RPC {}

    export class HTTP extends bweb.Server {
      public network: Network;
      public logger: LoggerContext | null;
      public node: Node | null;
      public chain: blockchain.Chain | null;
      public mempool: Pool | null;
      public fees: Fees | null;
      public miner: Miner | null;
      public rpc: any | null;
      constructor(options: Partial<HTTPOptions> & { node: wallet.Node });
    }

    export class HTTPOptions extends node.HTTPOptions {
      walletAuth: boolean;
    }

    /**
     * has same API with `WalletClient` but it works for local node.
     */
    export class NodeClient extends AsyncEmitter {
      network: NetworkType;
      filter?: BloomFilter;
      opened: boolean;
      constructor(node: node.Node);
      private init(): void;
      open(options?: any): Promise<void>;
      close(): Promise<void>;
      /**
       * Add listener
       */
      bind(type: string, handler: Function): void;
      hook(type: string, handler: Function): void;
      getTip(): Promise<ChainEntry>;
      getEntry(hash: Buffer): Promise<ChainEntry>;
      send(tx: TX): Promise<TX>;
      setFilter(filter: BloomFilter): Promise<void>;
      addFilter(filter: BloomFilter): Promise<void>;
      resetFilter(filter: BloomFilter): Promise<void>;
      estimateFee(blocks?: number): Promise<Rate>;
      getHashes(start?: number, end?: number): Promise<Buffer[]>;
      rescan(start?: number | Buffer): Promise<void>;
    }

    /**
     * client for a wallet to communicate with the remote node
     */
    class WalletClient extends bclient.NodeClient {}

    export class Client extends WalletClient {}

    /**
     * db for an individual wallets to hold its own tx data
     */
    export class TXDB {
      wdb: WalletDB;
      db: DB;
      logger: LoggerContext;
      wid: number;
      bucket?: Bucket;
      wallet?: Wallet;
      /**
       * Keys for locked UTXO
       */
      locked: BufferSet<KeyRing>;
      open(wallet: Wallet): Promise<void>;
      getPath(output: Output): null | Path;
      getPath(output: Output): Promise<Path>;
      hasPath(output: Output): Promise<boolean>;
      saveCredit(b: Batch): Promise<void>;
      removeCredit(b: Batch, credit: Credit, path: Path): Promise<void>;
      spendCredit(b: Batch, credit: Credit, tx: TX, index: number): void;
      unspendCredit(b: Batch, tx: TX, index: number): void;
      writeInput(b: Batch, tx: TX, index: number): Promise<void>;
      removeInput(b: Batch, tx: TX, index: number): Promise<void>;
      updateBalance(b: Batch, state: BalanceDelta): Promise<Balance>;
      updateAccountBalance(
        b: Batch,
        acct: number,
        state: BalanceDelta
      ): Promise<Balance>;
      getSpent(hash: Buffer, index: number): Promise<Outpoint | null>;
      /**
       * Test wheter a coin has been spent.
       * @param hash
       * @param index
       */
      isSpent(hash: Buffer, index: number): Promise<boolean>;

      // ---- methods to tweek records.MapRecord --------
      public addBlockMap(b: DB | Bucket | Batch, height: number): Promise<void>;
      public removeBlockMap(
        b: DB | Bucket | Batch,
        height: Buffer
      ): Promise<void>;

      public addTXMap(b: DB | Bucket | Batch, hash: Buffer): Promise<void>;
      public removeTXMap(b: Bucket, hash: Buffer): Promise<void>;

      public addOutpointMap(
        b: Batch,
        hash: Buffer,
        index: number
      ): Promise<void>;
      public removeOutpointMap(
        b: Bucket,
        hash: Buffer,
        index: number
      ): Promise<records.MapRecord>;
      // ----------------------------
      getBlocks(): Promise<BlockRecord[]>;
      getBlock(height: number): Promise<null | BlockRecord>;
      removeBlock(b: Bucket, hash: Buffer, height: number): Promise<void>;
      spliceBlock(b: Bucket, hash: Buffer, height: number): Promise<void>;
      add(tx: TX, block: records.BlockMeta): Promise<null | Details>;
      private insert(
        wtx: records.TXRecord,
        block: records.BlockMeta
      ): Promise<null | Details>;
      private confirm(
        wtx: records.TXRecord,
        block: records.BlockMeta
      ): Promise<Details>;
      remove(hash: Buffer): Promise<void>;
      private erase(
        wtx: records.TXRecord,
        block: records.BlockMeta
      ): Promise<void>;
      revert(height: number): Promise<number>;
      disconnect(
        wtx: records.TXRecord,
        block: records.BlockMeta
      ): Promise<Details>;
      private removeConflicts(tx: TX, conf: number): Promise<boolean>;
      lockTX(tx: TX | Outpoint): void;
      unlockTX(tx: TX | Outpoint): void;
      lockCoin(coin: Coin | Outpoint): void;
      unlockCoin(coin: Coin | Outpoint): void;
      isLocked(coin: Coin | Outpoint): void;
      /**
       * Filter array of coins or outpoints for only unlocked ones.
       * @param coins
       */
      filterLocked(coins: Array<Coin | Outpoint>): Array<Coin | Outpoint>;
      getLocked(): Outpoint[];
      getAccountHistoryHashes(acct: number): Promise<Buffer[]>;
      getHistoryHashes(acct: number): Promise<Buffer[]>;
      /**
       * Get hashes of all unconfirmed transactions in the database.
       * @param acct
       */
      getAccountPendingHashes(acct: number): Promise<Buffer[]>;
      getAccountOutpoints(acct: number): Promise<Outpoint[]>;
      /**
       * Get all coin hashes in the database.
       * @param acct
       */
      getOutpoints(acct: number): Promise<Outpoint[]>;
      getAccountHeightRangeHashes(
        acct: number,
        options: RangeQueryOption
      ): Promise<Buffer[]>;
      getHeightRangeHashes(
        acct: number,
        options: RangeQueryOption
      ): Promise<Buffer[]>;
      getHeightHashes(height: number): Promise<Buffer[]>;
      /**
       * Its almost the same with `getHeightRangeHashes`
       * But `start` and `end` is timestamp. not height.
       * @param acct
       * @param options
       */
      getRangeHashes(
        acct: number,
        options: RangeQueryOption
      ): Promise<Buffer[]>;
      public getRange(acct: number, options: RangeQueryOption): Promise<TX[]>;
      /**
       * get last N transactions.
       * @param acct
       * @param limit
       */
      public getLast(acct: number, limit: number): Promise<TX[]>;
      getHistory(accd: number): Promise<TX[]>;
      getAccountHistory(acct: number): Promise<TX[]>;
      getPending(acct: number): Promise<TX[]>;
      getCredits(acct: number): Promise<Credit[]>;
      getAccountCredits(acct: number): Promise<Credit[]>;
      /**
       * Fill a transaction with coins (all historical coins).
       * @param tx
       */
      public getSpentCredits(tx: TX): Promise<Credit[]>;
      getCoins(acct: number): Promise<Coin[]>;
      getAccountCoins(acct: number): Promise<Coin[]>;
      getSpentCoins(tx: TX): Promise<TX>;
      getCoinView(tx: TX): Promise<CoinView>;
      getSpentView(tx: TX): Promise<CoinView>;
      getTX(hash: Buffer): Promise<records.TXRecord | null>;
      getDetails(hash: Buffer): Promise<Details | null>;
      toDetails(wtxs: records.TXRecord): Promise<Details[]>;
      hasTX(hash: Buffer): Promise<boolean>;
      getCoin(hash: Buffer, index: number): Promise<Coin>;
      getCredit(hash: Buffer, index: number): Promise<Coin>;
      //------ skipping several methods here...

      public getBalance(acct?: number): Promise<Balance>;
      /**
       * Zap pending transactions older than `age`
       * @param acct
       * @param age
       */
      zap(acct: number, age: number): Promise<Buffer[]>;
      abandon(hash: Buffer): Promise<void>;
    }
    interface RangeQueryOption {
      /**
       * Start height
       */
      start: number;
      /**
       * End height
       */
      end: number;
      /**
       * max number of records
       */
      limit?: number;
      /**
       * Reverse order.
       */
      reverse?: boolean;
    }

    export class MasterKey {
      /**
       * Key derivation salt
       */
      static salt: Buffer;
      encrypted: boolean;
      iv?: Buffer;
      ciphertext?: Buffer;
      key?: HDPrivateKey;
      mnemonic: Mnemonic;
      alg: CKDAlg;
      n: number;
      r: number;
      p: number;
      aesKey?: Buffer;
      timer?: number;
      until: number;
      locker: Lock;
      constructor(options: MasterKeyOptions);
      static fromOptions(options: MasterKeyOptions): MasterKey;
      unlock(
        passphrase: string | Buffer,
        timeout?: number
      ): Promise<HDPrivateKey>;
      private start(timeout?: number): void;
      private stop(): void;
      public derive(passwd: string | Buffer): Promise<Buffer>;
      encipher(data?: Buffer, iv?: Buffer): Buffer;
      decipher(data?: Buffer, iv?: Buffer): Buffer;
      lock(): Promise<void>;
      destroy(): Promise<void>;
      decrypt(passphrase: Buffer | string): Promise<Buffer>;
      keySize(): number;
      writeKey(): Buffer;
      readKey(): Buffer;
      getSize(): number;
      toWriter(bw: BufferWriter): BufferWriter;
      toRaw(): Buffer;
      static fromReader(br: BufferReader): MasterKey;
      static fromRaw(raw: Buffer): MasterKey;
      static fromKey(key: HDPrivateKey, Mnemonic?: Mnemonic): MasterKey;
      toJSON(network?: Network | NetworkType): MasterKeyJson;
      inspect(network?: Network, unsafe?: boolean): MasterKeyJson;
      static isMasterKey(obj?: object): boolean;
    }

    type MasterKeyJson = EncryptedMasterkeyJson | RawMasterKeyJSon;

    interface EncryptedMasterkeyJson {
      encrypted: true;
      until: number;
      iv: string;
      ciphertext?: string;
      algorithm: CKDAlgByValLower;
      n: number;
      r: number;
      p: number;
    }
    interface RawMasterKeyJSon {
      encrypted: boolean;
      key?: hd.PrivateKeyJson;
      mnemonic?: Mnemonic;
    }

    interface MasterKeyOptions {
      encrypted?: boolean;
      iv?: Buffer;
      ciphertest?: Buffer;
      key?: HDPrivateKey;
      alg?: CKDAlgByValLower | CKDAlg;
      rounds?: number;
      n?: number;
      r?: number;
      p?: number;
    }
    /**
     * Child Key Derivation algorithm
     */
    export enum CKDAlg {
      PBKDF2 = 0,
      SCRIPT = 1
    }
    export type CKDAlgByVal = 'PBKDF2' | 'SCRYPT';
    export type CKDAlgByValLower = 'pbkdf2' | 'scrypt';
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
    export class WalletKey extends primitives.KeyRing {
      keyType: PathType;
      name?: string;
      account: number;
      branch: number;
      index: number;
      constructor(options?: primitives.KeyringOptions);
      toJSON(network?: Network | NetworkType): WalletKeyJsonOutput;
      static fromHD(
        account: Account,
        key: HDPrivateKey | HDPublicKey,
        branch: number,
        index: number
      ): WalletKey;
      static fromImport(account: Account, data: Buffer): WalletKey;
      static fromRing(account: Account, ring: KeyRing): WalletKey;
      toPath(): Path;
      static isWalletKey(obj: object): boolean;
    }

    export type WalletKeyJsonOutput = {
      name: string;
      account: string;
      branch: number;
      index: number;
    } & primitives.KeyringJsonOutput;

    enum PathType {
      HD = 0,
      KEY = 1,
      ADDRESS = 2
    }

    type PathTypeByVal = 'HD' | 'KEY' | 'ADDRESS';
    export class Path {
      static types: PathType;
      static typesByVal: PathTypeByVal[];
      keyType: PathType;
      name: string;
      account: Account;
      branch: number;
      index: number;
      encrypted: boolean;
      data?: Buffer;
      type: primitives.AddressTypeNum;
      version: number;
      hash: Buffer;
      constructor(options?: Partial<Path>);
      static fromOptions(options?: Partial<Path>): Path;
      clone(): Path;
      static fromRaw(): Path;
      getSize(): number;
      static fromAddress(account: Account, address: Address): Path;
      /**
       * convert path object to raw bitcoinjs-lib style path.
       */
      toPath(): string;
      toAddress(): Address;
      toJSON(): PathJson;
      inspect(): string;
    }

    export interface PathJson {
      name: string;
      account: Account;
      change: boolean;
      derivation: string;
    }
    export class WalletDB {
      options: WalletOptions;
      network: Network;
      logger: LoggerContext;
      workers: WorkerPool;
      client: NodeClient | NullClient;
      feeRate: Rate;
      db: DB;
      primary: null | Wallet; // set when open()'d
      state: records.ChainState;
      height: number;
      wallets: Map<WID, Wallet>;
      depth: number;
      rescanning: boolean;
      filterSent: boolean;
      readLock: MapLock;
      writeLock: Lock;
      filter: BloomFilter;
      constructor(options?: Partial<WalletOptions> & Partial<DBOptions>);
      public open(): Promise<void>;
      /**
       * Check if this.network and network info saved to db
       * is consistent.
       */
      private verifyNetwork(): Promise<void>;
      public close(): Promise<void>;
      public disconnect(): Promise<void>;
      /**
       * Set all address hashes and outpoint from db to `this.filter`
       */
      private watch(): Promise<void>;
      private connect(): Promise<void>;
      /**
       * Sync state with the node server. Runs
       * 1. syncState
       * 2. syncFilter
       * 3. syncChain
       * 4. resend
       * This will start automatically when client has connected to the node.
       */
      private syncNode(): Promise<void>;
      private syncState(): Promise<void>;
      private migrateState(state: records.ChainState): Promise<void>;
      private syncChain(): Promise<void>;
      private scan(height?: number): Promise<void>;
      /**
       * Force rescan with a lock.
       * @param height
       */
      public rescan(height: number): Promise<void>;
      public send(tx: TX): Promise<void>;
      /**
       * If `this.feeRate` is greater than 0, return that.
       * Otherwise asks it to the node.
       * @param block - confirmation number
       */
      public estimateFee(block: number): Promise<Rate>;
      /**
       * Send filter to the remote node.
       */
      private syncFilter(): Promise<void>;
      /**
       * Add filter to the remote node
       * @param data
       */
      private addFilter(data): Promise<void>;
      /**
       * Reset remote filter
       */
      private resetFilter(): Promise<void>;
      /**
       * Backup the wallet db.
       * @param path
       */
      public backup(path: string): Promise<void>;
      /**
       * Wipe the txdb
       */
      public wipe(): Promise<void>;
      /**
       * Get current wallet wid depth (i.e. number of wallet ids hold.)
       */
      private getDepth(): Promise<void>;
      private testFilter(data: Buffer): boolean;
      private addhash(hash: Buffer): void;
      private addOutpoint(hash: Buffer, index: number): void;
      private dump(): Promise<void>;
      /**
       * Register an object with the walletdb.
       * used by this.ensure, this.get, this.create
       */
      private register(wallet: Wallet): void;
      private unregister(wallet: Wallet): void;
      /**
       * Convert id to wid.
       * @param id
       */
      private ensureWID(id: string | number): number;
      /**
       * Convert wid to id
       * @param id
       */
      private getID(id: string | number): string;
      public get(id: number | string): Promise<Wallet | null>;
      public save(b: DB | Batch, wallet: Wallet): void;
      public increment(b: Batch, wid: WID): void;
      public rename(wallet: Wallet, id: string): Promise<void>;
      public renameAccount(b: Batch | DB, account: Account, name: string): void;
      /**
       * Remove wallet.
       * @param id
       */
      public remove(id: number | string): Promise<void>;
      /**
       * Get wallet with token auth first
       */
      public auth(id: number | string, token: Buffer): Promise<Wallet | null>;
      /**
       * Create a new wallet
       * Throws error if already exists.
       * @param options
       */
      public create(options: Partial<WalletOptions>): Promise<Wallet>;
      public has(id: number | string): Promise<boolean>;
      /**
       * Create a new wallet.
       * return the wallet if already exists.
       * @param options
       */
      public ensure(options: Partial<WalletOptions>): Promise<Wallet>;
      private getAccount(wid: WID, index: number): Promise<Account | null>;
      /**
       * Get all accounts name
       * @param wid
       */
      public getAccounts(wid: WID): string[];
      public getAccountIndex(wid: WID, name: string): Promise<number>;
      public getAccountName(wid: WID, index: number): Promise<string>;
      public saveAccount(b: Batch | DB, account: Account): Promise<void>;
      public hasAccount(wid: WID, acctIndex: number): Promise<boolean>;
      /**
       * Save addresses to path map.
       * @param b
       * @param wallet
       * @param ring
       */
      public saveKey(
        b: DB | Batch,
        wallet: Wallet,
        ring: WalletKey
      ): Promise<void>;
      public savePath(b: DB | Batch, wid: WID, path: string): Promise<void>;
      public getPath(wid: WID, hash: Buffer): Promise<Path | null>;
      public readPath(wid: number, hash: Buffer): Promise<Path>;
      public hasPath(wid: WID, hash: Buffer): Promise<boolean>;
      /**
       * Get all address hashes.
       */
      public getHashes(): Promise<Buffer[]>;
      /**
       * Get all Outpoints.
       */
      public getOutpoints(): Promise<Outpoint[]>;
      /**
       * Get all address hashes for wallet
       */
      public getWalletHashes(wid: WID): Promise<Buffer[]>;
      public getAccountHashes(
        wid: WID,
        accountIndex: number
      ): Promise<Buffer[]>;
      public getWalletPaths(wid: WID): Promise<Path[]>;
      public getWallets(): Promise<WID[]>;
      public encryptKeys(b: Bucket | DB, wid: WID, key: Buffer): Promise<void>;
      public decryptKeys(b: Bucket | DB, wid: WID, key: Buffer): Promise<void>;
      /**
       * resend every pending tx.
       * @param wid
       */
      public resend(): Promise<void>;
      /**
       * resend every pending tx for specific wallet.
       * @param wid
       */
      private resendPending(wid: WID): Promise<void>;
      public getWalletsByTX(tx: Buffer): Promise<WID[] | null>;
      public getState(): Promise<null | records.ChainState>;
      public setTip(tip: records.BlockMeta): Promise<void>;
      private markState(block: records.BlockMeta): Promise<void>;

      // ----- MapRecord related methods ------
      // called from `get[TX|Path|Outpoint|Block]Map`
      private getMap(key: Buffer): Promise<null | records.MapRecord>;
      private addMap(
        b: DB | Bucket | Batch,
        key: Buffer,
        wid: WID
      ): Promise<void>;
      private removeMap(
        b: DB | Bucket | Batch,
        key: Buffer,
        wid: WID
      ): Promise<void>;

      public getPathMap(hash: Buffer): Promise<records.MapRecord | null>;
      public addPathMap(
        b: DB | Bucket | Batch,
        key: Buffer,
        wid: WID
      ): Promise<void>;
      public removePathMap(b: Batch, hash: Buffer, wid: WID): Promise<void>;

      public getBlockMap(height: Buffer): Promise<records.MapRecord | null>;
      public addBlockMap(
        b: DB | Bucket | Batch,
        height: number,
        wid: WID
      ): Promise<void>;
      public removeBlockMap(
        b: DB | Bucket | Batch,
        height: Buffer,
        wid: WID
      ): Promise<void>;

      public getTXMap(hash: Buffer): Promise<null | records.MapRecord>;
      public addTXMap(
        b: DB | Bucket | Batch,
        hash: Buffer,
        wid: WID
      ): Promise<void>;
      public removeTXMap(b: Bucket, hash: Buffer, number: WID): Promise<void>;

      public getOutpointMap(
        hash: Buffer,
        index: number
      ): Promise<records.MapRecord>;
      public addOutpointMap(
        b: Batch,
        hash: Buffer,
        index: number,
        wid: number
      ): Promise<void>;
      public removeOutpointMap(
        b: Bucket,
        hash: Buffer,
        index: number,
        wid: WID
      ): Promise<records.MapRecord>;
      // ----------------------------

      private getBlock(height: Buffer): Promise<null | records.BlockMeta>;
      public getTip(): Promise<records.BlockMeta>;
      private rollback(height: number): Promise<void>;
      /**
       * Revert txdb to older state
       * @param target
       */
      private revert(target: number): Promise<void>;
      /**
       *
       * @param entry
       * @param txs
       * @returns - number of TX added
       */
      private addBlock(entry: ChainEntry, txs: TX[]): Promise<number>;
      private rescanBlock(entry: ChainEntry, txs: TX[]): Promise<void>;
      public addTX(tx: TX): Promise<null | WID[]>;
      public resetChain(entry: ChainEntry): Promise<void>;
    }

    export class WalletOptions {
      network: Network;
      logger: Logger;
      workers?: WorkerPool;
      client?: NodeClient;
      feeRate?: number;
      prefix?: string;
      location?: string;
      memory: boolean;
      maxFiles: number;
      cacheSize: number;
      compression: boolean;
      spv: boolean;
      witness: boolean;
      checkponts: boolean;
      wipeNoReally: boolean;
      constructor(options?: Partial<WalletOptions>);
      static fromOptions(options: Partial<WalletOptions>): WalletOptions;
    }

    class NullClient {}

    export namespace records {
      export class ChainState {
        startHeight: number;
        startHash: number;
        height: number;
        marked: boolean;
      }
      export class BlockMeta {
        hash: Buffer;
        height: number;
        time: number;
      }

      export class TXRecord {
        tx?: TX;
        hash?: Buffer;
        mtime: number;
        height: number;
        block?: BlockMeta;
        index: number;
        time: number;
      }

      export class MapRecord {
        wids: Set<WID>;
      }
    }
    /**
     * type emitted by walletdb
     */
    export type WalletDBEvent = 'address';
    export type WalletEvent = 'address';
  }

  export class Wallet extends wallet.Wallet {}

  export class Path extends wallet.Path {}
  export class WalletKey extends wallet.WalletKey {}
  export class WalletDB extends wallet.WalletDB {}
}
