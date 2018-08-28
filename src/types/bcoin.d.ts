// Type definitions for bcoin 1.0.2
// Project: https://github.com/bcoin-org/bweb
// Definitions by: Joe Miyamoto <joemphilips@gmail.com>

declare module 'bcoin' {
  import { BloomFilter, RollingFilter } from 'bfilter';
  import { BufferWriter, BufferReader } from 'bufio';
  import { BufferMap } from 'buffer-map';
  import BN from 'bn.js';
  import AsyncEmitter from 'bevent';
  import { EventEmitter } from 'events';
  import Logger, { LoggerContext } from 'blgr';
  import * as bweb from 'bweb';
  import * as bclient from 'bclient';
  import { DB, Batch, DBOptions, Bucket } from 'bdb';
  import { Lock, MapLock } from 'bmutex';
  import Config, { ConfigOption } from 'bcfg';
  import LRU from 'blru';

  export abstract class BcoinPlugin {
    static init(node: Node): BcoinPluginInstance;
  }

  export abstract class BcoinPluginInstance {
    public open(): Promise<void>;
    public close(): Promise<void>;
  }

  type SighashType = 'ALL' | 'NONE' | 'SINGLE' | 1 | 2 | 3 | 0x08;

  /**
   * Fee rate per kilobyte/satoshi.
   */
  type Rate = number;

  /**
   * Currently, some hashes are represented as hex string
   * for the sake of performance.
   * but in the near future, it will use Buffer instead. This type
   * is supposed to represent that type going to change.
   * refs: https://github.com/bcoin-org/bcoin/issues/533
   */
  type HashKey = Buffer;
  export namespace blockchain {
    export class Chain extends AsyncEmitter {
      opened: boolean;
      options: ChainOptions;
      network: Network;
      logger: LoggerContext;
      workers?: WorkerPool;
      db: ChainDB;

      locker: Lock;
      invalid: LRU;
      state: DeploymentState;

      tip: ChainEntry;
      height: number;
      synced: boolean;

      orphanMap: BufferMap<Orphan>;
      orphanPrev: BufferMap;

      constructor(options?: Partial<ChainOptions>);
      open(): Promise<void>;
      close(): Promise<void>;
      private verifyContext(
        block: Block,
        prev: ChainEntry,
        flags: number
      ): Promise<ContextResult>;
      /**
       * perform all necessary contextual verification on a block,
       * excepts for PoW check.
       * @param block
       */
      public verifyBlock(block: Block): Promise<ContextResult>;
      public isMainHash(hash: HashKey): Promise<boolean>;
      isMainChain(entry: ChainEntry): Promise<boolean>;
      getAncestor(
        entry: ChainEntry,
        height: number
      ): Promise<ChainEntry | null>;
      getPrevious(entry: ChainEntry): Promise<ChainEntry | null>;
      getPrevCache(entry: ChainEntry): Promise<ChainEntry | null>;
      getNext(entry: ChainEntry): Promise<ChainEntry | null>;
      getNextEntry(entry: ChainEntry): Promise<ChainEntry | null>;
      getMedianTime(prev: ChainEntry, time?: number): Promise<number>;
      /**
       * returns true if entry is an ancestor of a checkpoint.
       * @param prev
       */
      isHistorical(prev: ChainEntry): Promise<boolean>;
      private verify(
        block: Block,
        prev: ChainEntry,
        flags: number
      ): Promise<DeploymentState>;
      public getDeployments(
        time: number,
        prev: ChainEntry
      ): Promise<DeploymentState>;
      private setDeploymentState(state: DeploymentState): void;
      private verifyDuplicates(block: Block, prev: ChainEntry): Promise<void>;
      private updateInputs(block: Block, prev: ChainEntry): Promise<CoinView>;
      /**
       * Perform contextual check to block transactions.
       * @param block
       * @param prev
       * @param state
       */
      private verifyInputs(
        block: Block,
        prev: ChainEntry,
        state: DeploymentState
      ): Promise<CoinView>;
      /**
       * Find common ancestor block for two blocks
       */
      private findFork(
        fork: ChainEntry,
        longer: ChainEntry
      ): Promise<ChainEntry>;

      /**
       * Called from setBestChain
       * @param competitor
       */
      private reorganize(competitor: ChainEntry): Promise<void>;
      private setBestChain(
        entry: ChainEntry,
        block: Block,
        prev: ChainEntry,
        flags: number
      ): Promise<void>;
      private saveAlternate(
        entry: ChainEntry,
        block: Block,
        prev: ChainEntry,
        flags: number
      ): Promise<void>;
      public reset(block: HashKey | number): Promise<void>;
      public replay(block: HashKey | number): Promise<void>;
      public invalidate(hash: HashKey): Promise<void>;
      public prune(): Promise<void>;
      public scan(
        start: HashKey,
        filter: BloomFilter,
        iter: ScanIterator
      ): Promise<void>;
      /**
       * Add block to the chain.
       */
      public add(
        block: Block,
        flags?: number,
        id?: number
      ): Promise<ChainEntry | null>;
      private connect(
        prev: ChainEntry,
        block: Block,
        flags: number
      ): Promise<ChainEntry>;
      private handleOrphans(entry: ChainEntry): Promise<void>;
      private isSlow(): boolean;
      private logStatus(
        start: [number, number],
        block: Block,
        entry: ChainEntry
      ): void;
      private verifyCheckpoint(prev: ChainEntry, hash: Buffer): boolean;
      private storeOrphan(block: Block, flags?: number, id?: number): void;
      private addOrphan(orphan: Orphan): Orphan;
      private removeOrphan(orphan: Orphan): Orphan;
      private hasNextOrphan(hash: Buffer): Orphan;
      private resolveOrphan(hash: Buffer): null | Orphan;
      public purgeOrphans(): null;
      public limitOrphans(): null;
      private hasInvalid(block: Block): boolean;
      private setInvalid(hash: Buffer): void;
      private removeInvalid(hash: Buffer): void;
      /**
       * Search chain (including orphans, invalids) to see if it has a block
       * @param hash - Block hash
       */
      public has(hash: Buffer): Promise<boolean>;
      public getEntry(hashOrHeight: Buffer | number): ChainEntry | null;
      public getHash(height: number): Buffer | null;
      public getHeight(hash: Buffer): number;
      public hasEntry(hash: Buffer): Promise<boolean>;
      public getNextHash(hash: Buffer): Promise<Buffer | null>;
      public hasCoins(tx: TX): Promise<boolean>;
      public getTips(): Promise<Buffer[]>;
      public getHashes(start?: number, end?: number): Promise<Buffer[] | null>;
      private readCoin(prevOut: Outpoint): Promise<CoinEntry | null>;
      public getCoin(hash: Buffer, index: number): Promise<Coin | null>;
      public getBlock(hash: Buffer): Promise<Block | null>;
      public getRawBlock(hash: Buffer): Promise<Buffer | null>;
      public getBlockView(block: Block): Promise<CoinView>;
      public getMeta(hash: Buffer): Promise<primitives.TXMeta | null>;
      public getTX(hash: Buffer): Promise<primitives.TX | null>;
      public hasTX(hash: Buffer): Promise<boolean>;
      public getCoinsByAddress(addrs: Address[]): Promise<Coin[] | null>;
      public getHashesByAddress(addrs: Address[]): Promise<Buffer[] | null>;
      public getTXByAddress(addrs: Address[]): Promise<TX[] | null>;
      public getMetaByAddress(
        addrs: Address[]
      ): Promise<primitives.TXMeta[] | null>;
      public getOrphan(hash: Buffer): Block | null;
      public hasOrphan(hash: Buffer): boolean;
      public hasPending(hash: Buffer): boolean;
      public getCoinView(tx: TX): Promise<CoinView>;
      public getSpentView(tx: TX): Promise<CoinView>;
      /**
       * Test the chain if it is fully synced
       */
      public isFull(): boolean;
      /**
       * Check if chain is synced.
       * If it is, emit `"full"` event and set `this.synced` to `true`
       */
      private maybeSync(): void;
      public hasChainWork(): boolean;

      public getProgress(): number;
      /**
       * Calculate chain locator (array of hashes).
       * @param start - Height or hash to treat as the tip.
       * The current tip will be used if not present.
       */
      public getLocator(start?: HashKey): Promise<HashKey[]>;
      public getOrphanRoot(hash: HashKey): HashKey;
      public getProofTime(to: ChainEntry, from: ChainEntry): number;
      public getCurrentTarget(): Promise<number>;
      public getTarget(time: number, prev: ChainEntry): Promise<number>;
      public retarget(prev: ChainEntry, first: ChainEntry): number;
      /**
       * Equivalent to `FindForkInGlobalIndex()` in bitcoind
       * @param locator
       */
      public findLocator(locator: HashKey[]): Promise<HashKey>;

      // -------- bip9 related methods ---------
      /**
       * Check whether a versionbits deployment is active
       * @param prev
       * @param deployment
       * @example
       * await chain.isActive(tip, deployments.segwit);
       */
      public isActive(prev: ChainEntry, deployment: string): Promise<boolean>;
      /**
       * get bip9 state
       * 1. defined
       * 2. started
       * 3. locked_in
       * 4. active
       * 5. failed
       */
      public getState(
        prev: ChainEntry,
        deployment: string
      ): Promise<common.thresholdStates>;
      /**
       * Compute the version for a new block (BIP9: versionbits)
       * @param prev
       */
      public computeBlockVersion(
        prev: ChainEntry
      ): Promise<common.thresholdStates>;
      private getDeploymentState(): Promise<DeploymentState>;
      /**
       * check finality of transaction by calling tx.isFinal()
       * which examines nLocktime an nSequence
       * @param prev
       * @param tx
       * @param flags
       */
      public verifyFinal(
        prev: ChainEntry,
        tx: TX,
        flags: common.lockFlags
      ): Promise<boolean>;
      /**
       * @returns Array - tuple of minimum time and sequence of locks for tx
       *
       */
      private getLocks(
        prev: ChainEntry,
        tx: TX,
        view: CoinView,
        flags: common.lockFlags
      ): Promise<[number, number]>;
      /**
       * verify sequence locks
       */
      public verifyLocks(
        prev: ChainEntry,
        tx: TX,
        view: CoinView,
        flags: common.lockFlags
      ): Promise<boolean>;
    }

    class Orphan {}

    export namespace common {
      /**
       * flags for timelock verification.
       */
      export enum lockFlags {
        VERIFY_SEQUENCE = 1,
        MEDIAN_TIME_PAST = 2
      }

      /**
       * BIP9 threshold
       */
      export enum thresholdStates {
        DEFINED = 0,
        STARTED = 1,
        LOCKED_IN = 2,
        ACTIVE = 3,
        FAILED = 4
      }

      export enum flags {
        VERIFY_NONE = 0,
        VERIFY_POW = 1,
        VERIFY_BODY = 2
      }
    }

    export class VerifyError extends Error {}

    type ContextResult = [CoinView, DeploymentState];

    type ChainOptions = {
      network: Network | NetworkType;
      logger: Logger;
      workers?: WorkerPool;
      prefix?: string;
      location?: string;
      memory?: boolean;
    } & ChainDBOptions;

    class DeploymentState {
      flags: number;
      lockFlags: common.lockFlags;
      bip34: boolean;
      bip91: boolean;
      bip148: boolean;
      constructor();
      [key: string]: any;
    }

    export class ChainDB {
      options: Partial<ChainDBOptions>;
      network: Network;
      db: DB;
      stateCache: StateCache;
      state: ChainState;
      pending: null | ChainState;
      current: Batch | null;
      coinCache: LRU;
      cacheHash: LRU;
      cacheHeight: LRU;
      constructor(options: ChainDBOptions);
      open(): Promise<void>;
      close(): Promise<void>;
      start(): Batch;

      // ----- these methods all works for current batch.------
      put(key: string, value: Buffer): void;
      del(key: string): void;
      /**
       * Get currenct batch
       */
      batch(): Batch;
      drop(): void;
      commit(): Promise<void>;
      // ------------------------------------------------------

      /**
       * @param block - Blockhash or height.
       */
      hasCache(block: Buffer | number): boolean;
      /**
       * @param block - Blockhash or height.
       */
      getCache(block: Buffer | number): Block;
      getHeight(hash: HashKey): Promise<number>;
      getHash(hash: HashKey): Promise<number>;
      private getEntryByHeight(height: number): Promise<ChainEntry>;
      private getEntryByHash(hash: HashKey): Promise<ChainEntry>;
      getEntry(block: number | HashKey): Promise<ChainEntry>;
      hasEntry(hash: HashKey): Promise<boolean>;
      getAncestor(entry: ChainEntry, height: number): Promise<ChainEntry>;
      getPrevious(entry: ChainEntry): Promise<ChainEntry>;
      getPrevCache(entry: ChainEntry): Promise<ChainEntry | null>;
      getPrevious(entry: ChainEntry): Promise<ChainEntry>;
      getNext(entry: ChainEntry): Promise<ChainEntry>;
      getNextEntry(entry: ChainEntry): Promise<ChainEntry>;
      getTip(): Promise<ChainEntry>;
      getState(): Promise<ChainState>;
      getFlags(): Promise<ChainFlags | null>;
      getStateCache(): Promise<StateCache>;

      // ------ these are called on initial db load ------
      private verifyFlags(state: ChainState): Promise<void>;
      private verifyDeployments(): Promise<boolean>;
      private checkDeployments(): Promise<boolean>;

      // ------ these are called only when db initialized -------
      private saveDeployments(): Promise<void>;
      private saveGenesis(): Promise<void>;
      private saveFlags(): Promise<void>;
      private writeDeployments(): Promise<void>;

      /**
       * Retroactively prune the database.
       * Called only when forceFlags is true.
       */
      prune(): Promise<boolean>;
      getNextHash(hash: HashKey): Promise<string>;
      isMainHash(hash: HashKey): Promise<boolean>;
      isMainChain(entry: ChainEntry): Promise<boolean>;
      getHashes(start?: number, end?: number): Promise<string[]>;
      /**
       * get all entries
       */
      getEntries(): Promise<ChainEntry[]>;
      getTips(): Promise<HashKey[]>;
      private readCoin(): Promise<CoinEntry>;
      getCoin(hash: HashKey, index: number): Promise<Coin>;
      /**
       * necessary for bip30
       * @param tx
       */
      hasCoins(tx): Promise<boolean>;
      getCoinView(tx: TX): Promise<CoinView>;
      getSpentView(tx: TX): Promise<CoinView>;
      getUndoCoins(hash: HashKey): Promise<Coin[]>;
      getBlock(hash: HashKey): Promise<Block | null>;
      private getRawBlock(block: HashKey): Promise<Block | null>;

      /**
       * The result view will be passed to `block.getJSON`
       * It is necessary to make sure tx in the block has prevOut.
       * @param block
       */
      getBlockView(block: Block): Promise<CoinView>;
      /**
       * get a TX with metadata.
       * indexTX must be set to `true`.
       * @param hash - transaction's hash
       */
      getMeta(hash: HashKey): Promise<primitives.TXMeta | null>;
      getTX(hash: HashKey): Promise<TX>;
      hasTX(hash: HashKey): Promise<boolean>;
      /**
       * `indexAddress` must be `true` to use this.
       * otherwise it will return empty array.
       * @param addrs
       */
      getCoinsByAddress(addrs: Address[]): Promise<Coin[]>;
      /**
       * returns transaction hashes for the address.
       * @param addrs
       */
      getHashesByAddress(addrs: Address[]): Promise<HashKey[]>;
      getTXByAddress(addrs: Address[]): Promise<TX[]>;
      getMetaByAddress(addrs: Address[]): Promise<primitives.TXMeta>;
      scan(
        start: HashKey | number | null,
        filter: BloomFilter,
        iter: ScanIterator
      ): Promise<void>;
      /**
       * save block as a new tip. Which does not perform any verification.
       * @param entry
       * @param block
       * @param view
       */
      save(entry: ChainEntry, block: Block, view?: CoinView): Promise<void>;
      reconnect(entry: ChainEntry, block: Block, view: CoinView): Promise<void>;
      disconnect(entry: ChainEntry, block: Block): Promise<CoinView>;
      reset(block: HashKey | number): Promise<ChainEntry>;
      private removeChains(): Promise<void>;
      private saveBlock(
        entry: ChainEntry,
        block: Block,
        view?: CoinView
      ): Promise<Block>;
      private removeBlock(entry: ChainEntry): Promise<Block>;
      private saveView(view: CoinView): Promise<void>;
      private connectBlock(
        entry: ChainEntry,
        block: Block,
        view: CoinView
      ): Promise<Block>;
      private disconnectBlock(
        entry: ChainEntry,
        block: Block
      ): Promise<CoinView>;
      private pruneBlock(entry): Promise<void>;
      private indexTX(
        tx: TX,
        view: CoinView,
        entry: ChainEntry,
        index: number
      ): Promise<void>;
      private unindexTX(tx: TX, view: CoinView): Promise<void>;
    }
    export type ScanIterator = (entry: ChainEntry, txs: TX[]) => Promise<void>;

    type ChainDBOptions = Partial<ChainFlagsOption> & {
      network: Network;
      logger: LoggerContext;
      coinCache: number;
      entryCache: number;
      /**
       * Most of ChainFlags can not be retroactively changed.
       * But this option will for change.
       */
      forceFlags: boolean;
    };

    class ChainFlags {
      public network: Network;
      spv: boolean;
      witness: boolean;
      bip91: boolean;
      bip148: boolean;
      prune: boolean;
      indexTX: boolean;
      indexAddress: boolean;
      constructor(options?: Partial<ChainFlagsOption>);
    }

    interface ChainFlagsOption {
      network: Network | NetworkType;
      spv: boolean;
      bip91: boolean;
      bip148: boolean;
      prune: boolean;
      indexTX: boolean;
      indexAddress: boolean;
    }

    class ChainState {
      public tip: HashKey;
      public tx: number;
      public coin: number;
      public value: number;
      public committed: boolean;

      constructor();
    }
    class StateCache {}

    class CacheUpdate {}

    export class ChainEntry {
      static MAX_CHAIN_WORK: BN;
      hash: HashKey;
      version: number;
      prevBlock: string;
      merkleRoot: string;
      time: number;
      bits: number;
      nonce: number;
      height: number;
      chainwork: BN;
      constructor(options?: ChainEntryOptions);
      fromOptions(options: ChainEntryOptions): Promise<ChainEntry>;
      static fromOptions(options: ChainEntryOptions, prev: ChainEntry);
      getProof(): BN;
      getChainwork(prev: ChainEntry): BN;
      isGenesis(): boolean;
      hasUnknown(network: Network): boolean;
      hasBit(bit: number): boolean;
      /**
       * Get little-endian block hash.
       */
      rhash(): HashKey;
      fromBlock(block: Block | MerkleBlock, prev?: ChainEntry): ChainEntry;
      static fromBlock(
        block: Block | MerkleBlock,
        prev?: ChainEntry
      ): ChainEntry;
      toRaw(): Buffer;
      fromRaw(data: Buffer): ChainEntry;
      static fromRaw(data: Buffer): ChainEntry;
      toJSON(): object;
      fromJSON(json: Object): ChainEntry;
      static fromJSON(json: Object): ChainEntry;
      toHeaders(): Headers;
      toInv(): InvItem;
      inspect(): object;
      static isChainEntry(obj: object): boolean;
    }

    export interface ChainEntryOptions {
      hash: HashKey;
      version: number;
      prevBlock: string;
      merkleRoot: string;
      time: number;
      bits: number;
      nonce: number;
      height: number;
      chainwork: BN;
    }
  }

  export class Chain extends blockchain.Chain {}
  export class ChainEntry extends blockchain.ChainEntry {}

  export namespace btc {
    export class Amount {}

    export class URI {}
  }

  export type Amount = btc.Amount;

  export type URI = btc.URI;
  export namespace hd {
    export type HDKey = HDPrivateKey | HDPublicKey;
    type PrivateKeyJson = { xprivkey: string; [key: string]: any };
    type PublicKeyJson = { xpubkey: string; [key: string]: any };
    export function fromBase58(
      xkey: string,
      network?: Network | NetworkType
    ): HDKey;

    export function generate(): HDPrivateKey;

    export function fromSeed(options: Buffer): HDPrivateKey;
    export function fromMnemonic(options: Mnemonic): HDPrivateKey;
    export function fromJSON(json: PrivateKeyJson | PublicKeyJson): HDKey;
    export function fromRaw(
      data: Buffer,
      network?: Network | NetworkType
    ): HDKey;
    export function from(
      options: Mnemonic | MnemonicOptions | string | Buffer
    ): HDKey;

    export function isPrivate(obj: object): boolean;

    export function isPublic(obj: object): boolean;

    export type wordlist = ReadonlyArray<string>;
    export class HDPrivateKey {
      depth: number;
      parentFingerPrint: number;
      childIndex: number;
      chainCode: Buffer;
      privateKey: Buffer;
      publicKey: Buffer;
      fingerPrint: number;
      constructor(options?: PrivateKeyOption);
      fromSeed(seed: Buffer);
      static fromOptions(options: PrivateKeyOption): HDPrivateKey;
      toPublic(): HDPublicKey;
    }

    interface PrivateKeyOption {
      depth: number;
      parentFingerPrint: number;
      childIndex: number;
      chainCode: Buffer;
      privateKey: Buffer;
    }

    export class PrivateKey extends HDPrivateKey {}

    export class HDPublicKey {}

    export class PublicKey extends HDPublicKey {}

    export class Mnemonic {}

    export interface MnemonicOptions {
      bits: number;
      language: string;
      phrase: string;
      entropy: Buffer;
    }
  }

  export class HDPrivateKey extends hd.HDPrivateKey {}

  export class HDPublicKey extends hd.HDPublicKey {}

  export class Mnemonic extends hd.Mnemonic {}

  export namespace mempool {
    class ConfirmStats {
      type: string;
      decay: number;
      maxConfirms: number;
      buckets: Float64Array;
      bucketMap: DoubleMap;
      confAvg: number[];
      curBlockConf: number[];
      unconfTX: number[];
      oldUnconfTx: Int32Array;
      curBlockTX: Int32Array;
      txAvg: Float64Array;
      curBlockVal: Float64Array;
      avg: Float64Array;
      logger?: LoggerContext;
      constructor(type: string, logger?: Logger);
      init(buckets: any[], maxConfirms: number, decay: number);
      clearCurrent(height: number): void;
      record(blocks: number, val: Rate | number): void;
      updateAverages(): void;
      estimateMedian(
        target: number,
        needed: number,
        breakpoint: number,
        greater: boolean,
        height: number
      ): Rate | number;
      addTX(height: number, val: number): number;
      removeTX(
        entryHeight: number,
        bestHeight: number,
        bucketIndex: number
      ): void;
      getSize(): number;
      toRaw(): Buffer;
      fromRaw(data: Buffer): ConfirmStats;
      static fromRaw(data: Buffer, type: string, logger?: Logger): ConfirmStats;
    }

    class DoubleMap {
      public buckets: any[][];
      constructor();
      insert(key, value): void;
      search(key: string): any;
    }
    class PolicyEstimator {
      static VERSION: number;
      public options: MempoolOptions;
      logger: Logger;
      minTrackedFee: number;
      minTrackedPri: number;
      feeStats: ConfirmStats;
      priStats: ConfirmStats;

      feeUnlikely: number;
      feeLikely: number;
      priUnlikely: number;
      priLikely: number;
      map: BufferMap;
      bestHeight: number;
      constructor(logger?: Logger);
      private init(): void;
      private reset(): void;
      private removeTX(hash: HashKey): void;
      isFeePoint(fee: Amount, priority: number): boolean;
      isPriPoint(fee: Amount, priority: number): boolean;
      processTX(entry: MempoolEntry, current: boolean): void;
      processBlockTX(height: number, entry: MempoolEntry): void;
      processBlock(
        height: number,
        entries: MempoolEntry[],
        current: boolean
      ): void;
      estimateFee(target: number, smart: boolean): Rate;
      estimatePriority(target: number, smart: boolean): number;
      getSize(): number;
      toRaw(): Buffer;
      fromRaw(data: Buffer): ConfirmStats;
      static fromRaw(data: Buffer, logger?: Logger): ConfirmStats;
      inject(estimator: PolicyEstimator): PolicyEstimator;
    }

    export class Fees extends PolicyEstimator {}

    export class Mempool {
      opened: boolean;
      options: MempoolOptions;
      network: Network;
      logger: LoggerContext;
      workers: WorkerPool;
      chain: Chain;
      fees: Fees;
      locker: Lock;

      cache: MempoolCache;
      size: number;
      freeCount: number;
      lastTime: number;
      lastFlush: number;
      tip: Buffer;
      waiting: BufferMap;
      orphans: BufferMap;
      map: BufferMap;
      spents: BufferMap;
      rejects: RollingFilter;
      coinIndex: CoinIndex;
      txIndex: TXIndex;

      constructor(options: MempoolArgument);

      public open(): Promise<void>;
      public close(): Promise<void>;
      public addBlock(block: ChainEntry, txs: TX[]): Promise<void>;
      /**
       * Notify the mempool that a block has been disconnected
       * fro the main chain (reinserts transactions into the mempool)
       * @param block
       * @param txs
       */
      public removeBlock(block: ChainEntry, txs: TX[]): Promise<void>;
      public _handleReorg(): Promise<void>;
      public reset(): Promise<void>;
      public limitSize(added: MempoolEntry): Promise<boolean>;
      public getTX(hash: Buffer): TX | null;
      public getEntry(hash: Buffer): MempoolEntry | null;
      public getCoin(hash: Buffer, index: number): Coin | null;
      /**
       * Check to see if a coin has been spent.
       * @param hash
       * @param index
       */
      public isSpent(hash: Buffer, index: number): boolean;
      public getSpent(hash: Buffer, index: number): MempoolEntry | null;
      public getSpentTX(hash: Buffer, index: number): TX | null;
      public getCoinsByAddress(addrs: Address[]): Coin[];
      public getTXByAddress(addrs: Address[]): TX[];
      public getMetaByAddress(addrs: Address[]): primitives.TXMeta[];
      public getMeta(hash: Buffer): primitives.TXMeta | null;
      /**
       * check if tx exists in mempool
       * @param hash - txid
       */
      public hasEntry(hash: Buffer): boolean;
      /**
       * similar to hasEntry, but checks for orphans too
       * @param hash
       */
      public has(hash: Buffer): boolean;
      /**
       * check if has been rejected recently
       * @param hash
       */
      public hasReject(hash: Buffer): boolean;
      /**
       * This will lock the mempool until the transaction is fully processed.
       * It will returns an Array of missing input tx id if fails.
       */
      public addTX(tx: TX, id?: number): Promise<null | Buffer[]>;
      public verify(entry: TX, view: CoinView): Promise<void>;
      /**
       * verify TX but without throwing error.
       * */
      public verifyResult(
        tx: TX,
        view: CoinView,
        flags: script.common.flags
      ): Promise<boolean>;
      private verifyInputs(
        tx: TX,
        view: CoinView,
        flags: script.common.flags
      ): Promise<void>;
      private addEntry(entry: MempoolEntry, view: CoinView): Promise<void>;
      /**
       * Generally called when new block is added to the main chain.
       * @param entry
       */
      private removeEntry(entry: MempoolEntry): void;
      /**
       * remove entry from the mempool ad recursively remove
       * spenders
       */
      public evictEntry(entry: MempoolEntry): void;
      private removeSpenders(entry: MempoolEntry): void;
      public countAncestors(entry: MempoolEntry): number;
      private updateAncestors(entry: MempoolEntry, map: Function): number;
      public countDescendants(entry: MempoolEntry): number;
      public getAncestors(entry: MempoolEntry): MempoolEntry[];
      public getDescendants(entry: MempoolEntry): MempoolEntry[];
      /**
       * Find a unconfirmed transactions that this transaction depends on.
       */
      public getDepends(tx: TX): Buffer[];
      public hasDepends(tx: TX): boolean;
      /**
       * get the full balance of all unspents in the mempool
       * (Useful for testing)
       */
      public getBalance(): Amount;
      public getHistory(): TX[];
      private getOrphan(hash: Buffer): TX;
      hasOrphan(hash: Buffer): boolean;
      private maybeOrphan(tx: TX, view: CoinView, id: number): null | Buffer[];
      public handleOrphans(parent: TX): Promise<TX[]>;
      private resolveOrphan(parent): Orphan[];
      private removeOrphan(hash: Buffer): boolean;
      private limitOrphans(): boolean;
      public isDoubleSpend(tx: TX): Promise<boolean>;
      /**
       * getCoinView with lock.
       */
      public getSpentView(tx: TX): Promise<CoinView>;
      private getCoinView(tx: TX): Promise<CoinView>;
      /**
       * Get all txid in the mempool.
       * Used for answering to MEMPOOL packets
       */
      public getSnapshot(): Buffer[];
      /**
       * Verify Sequence locks
       * @param tx
       * @param view
       * @param flags
       */
      public verifyLocks(
        tx: TX,
        view: CoinView,
        flags: blockchain.common.lockFlags
      );
      public verifyFinal(tx: TX, flags: blockchain.common.lockFlags);
      private trackEntry(entry: MempoolEntry, view: CoinView): any;
      private untrackEntry(entry: MempoolEntry, view: CoinView): any;
      private indexEntry(entry: MempoolEntry, view: CoinView): void;
      private removeDoubleSpends(tx): void;
      public getSize(): number;
      public prioritise(entry: MempoolEntry, pri: number, fee: Amount): void;
    }

    export type MempoolArgument = {
      chain: Chain; // mempool requires blockchain
    } & Partial<MempoolOptions>;

    export class MempoolOptions {
      network: Network | NetworkType;
      chain: Chain;
      logger: Logger;
      workers: WorkerPool;
      fees?: Fees;
      limitFree: boolean;
      limitFreeRelay: number;
      relayPriority: boolean;
      requireStandard: boolean;
      rejectAbsurdFees: number;
      prematureWitness: boolean;
      paranoidChecks: boolean;
      replaceByFee: boolean;
      maxSize: number;
      masOrphans: number;
      maxAncestors: number;
      expiryTime: number;
      minRelay: number;
      prefix?: string;
      location?: string;
      memory: boolean;
      maxFiles: number;
      cacheSize: number;
      compression: boolean;
      persistent: boolean;
      constructor(options: MempoolArgument);
      static fromOptions(options: MempoolArgument): MempoolOptions;
    }

    class TXIndex {
      index: BufferMap;
      map: BufferMap;
      constructor();
      reset(): void;
      get(addr: Buffer): TX[];
      getMeta(addr: Buffer): primitives.TXMeta[];
      insert(entry: primitives.TXMeta, view?: CoinView): void;
      remove(hash: Buffer): void;
    }

    class CoinIndex {
      index: BufferMap;
      map: BufferMap;
      constructor();
      reset(): void;
      get(addr: Buffer): Coin[];
      insert(tx: TX, index: number): void;
      remove(hash: Buffer, index: number): void;
    }

    class Orphan {}
    class MempoolCache {}

    export class MempoolEntry {}
  }

  export class Fees extends mempool.Fees {}

  export class Mempool extends mempool.Mempool {}

  export class MempoolEntry extends mempool.MempoolEntry {}

  export namespace mining {
    export class Miner {}
  }

  export type Miner = mining.Miner;

  export interface packets extends net.packets {}

  export class Peer extends net.Peer {}

  export class Pool extends net.Pool {}

  export namespace node {
    export class Node extends EventEmitter {
      config: Config;
      network: NetworkType;
      /**
       * if use memory db or not. default to true.
       */
      memory: boolean;
      starttime: number;
      bound: any[];
      stack: Array<any>;
      spv: boolean;
      chain?: blockchain.Chain;
      fees?: Fees;
      mempool?: Mempool;
      pool?: Pool;
      miner?: Miner;
      plugins?: Array<BcoinPluginInstance>;
      logger?: Logger;
      workers: WorkerPool;
      http?: bweb.Server;
      constructor(
        module: string,
        config?: Config,
        file?: string,
        options?: ConfigOption
      );

      ensure(): Promise<void>;

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
      public handleClose(): Promise<void>;
      use(plugin: BcoinPlugin): void;
      has(name: string): boolean;
      get(name: string): BcoinPluginInstance | null;
    }
    export class FullNode extends Node {
      opened: boolean;
      spv: boolean;
      chain: Chain;
      fees: Fees;
      mempool: Mempool;
      pool: Pool;
      miner: Miner;
      rpc: RPC;
      http: HTTP;
      constructor(options: ConfigOption);
      public open(): Promise<void>;
      public close(): Promise<void>;
      public scan(
        start: number | HashKey,
        filter: BloomFilter,
        Function: blockchain.ScanIterator
      ): Promise<void>;
      private broadcast(item: TX | Block): Promise<void>;
      /**
       * Try to broadcast tx.
       */
      public sendTX(tx: TX): Promise<void>;
      /**
       * Same with `sendTX` , but silence error.
       * @param tx
       */
      public relay(tx: TX): Promise<void>;
      public startSync(): any;
      public stopSync(): any;
      /**
       * Proxy for chain.getBlock
       * @param hash
       */
      getBlock(hash: HashKey): Promise<Block>;
      /**
       * Retrieve a coin from the mempool or chain database.
       * Takes into account spent coins in the mempool.
       * @param hash
       * @param index
       */
      getCoin(hash: HashKey, index: number): Promise<Coin | null>;
      getCoinsByAddress(addrs: Address[]): Promise<Coin[]>;
      getMetaByAddress(addrs: Address[]): Promise<primitives.TXMeta[]>;
      getMeta(hash: HashKey): Promise<primitives.TXMeta>;
      /**
       * retrieve a spent coin viewpoint from mempool or chain database.
       * @param meta - if meta.height is -1, then get from mempool.
       */
      getMetaView(meta: primitives.TXMeta): Promise<CoinView>;
      getTXByAddress(addrs: Address[]): Promise<TX[]>;
      getTX(hash: HashKey): Promise<TX>;
      hasTX(hash: HashKey): Promise<boolean>;
    }

    class RPC {}

    export class HTTPOptions {
      network: Network;
      logger: Logger | null;
      node: Node | null;
      apiKey: string;
      apiHash: Buffer;
      adminToken: Buffer;
      serviceHash: Buffer;
      noAuth: boolean;
      cors: boolean;
      prefix: null | string;
      host: string;
      port: number;
      ssl: boolean;
      keyFile: null | string;
      certFile: null | string;
    }

    export class HTTP extends bweb.Server {
      constructor(options: HTTPOptions);
    }

    export class SPVNode {}
  }

  export class Node extends node.Node {}

  export class FullNode extends node.FullNode {
    constructor(options: ConfigOption);
  }

  export class SPVNode extends node.SPVNode {}

  export namespace primitives {
    export class Address {
      type: AddressTypeNum;
      version: number;
      hash: Buffer;
      constructor(options?: Partial<AddressOptions>);
      fromOptions(options: AddressOptions): Address;
      static fromOptions(options: AddressOptions);
      public getHash(enc?: 'hex' | 'null'): Buffer;
      public isNull(): boolean;
      public equals(addr: Address): boolean;
      public getType(): AddressTypeLowerCase;
      /**
       * get network address prefix
       * @param network
       */
      public getPrefix(network?: Network | NetworkType): number;
      public getSize(): number;
      public toRaw(network?: Network | NetworkType): Buffer;
      public toBase58(network?: Network | NetworkType): string;
      public toBech32(network?: Network | NetworkType): string;
      public fromString(addr: string, network?: Network | NetworkType): Address;
      static fromString(addr: string, network?: Network | NetworkType): Address;
      public toString(network?: Network | NetworkType): string;
      inspect(): string;
      fromRaw(data: Buffer, network?: Network | NetworkType): Address;
      static fromRaw(data: Buffer, network?: Network | NetworkType): Address;
      static fromBase58(data: string, network?: Network): Address;
      static fromBech32(data: string, network?: Network): Address;
      /**
       * From output script
       */
      private fromScript(script: Script): Address | null;
      private fromWitness(witness: Witness): Address | null;
      private fromInputScript(script: Script): Address | null;
      static fromScript(script: Script): Address | null;
      static fromWitness(witness: Witness): Address | null;
      static fromInputScript(script: Script): Address | null;
      private fromHash(
        hash: Buffer,
        type: AddressType,
        version: number
      ): Address;
      static fromHash(
        hash: Buffer,
        type: AddressType,
        version: number
      ): Address;
      private fromPubkeyhash(hash: Buffer): Address;
      static fromPubkeyhash(hash: Buffer): Address;
      private fromScripthash(hash: Buffer): Address;
      static fromScripthash(hash: Buffer): Address;
      private fromWitnessPubkeyhash(hash: Buffer): Address;
      static fromWitnessPubkeyhash(hash: Buffer): Address;
      private fromWitnessScripthash(hash: Buffer): Address;
      static fromWitnessScripthash(hash: Buffer): Address;
      private fromProgram(version: number, hash: Buffer): Address;
      static fromProgram(version: number, hash: Buffer): Address;
      public isPubkeyhash(): boolean;
      public isScriptHash(): boolean;
      public isWitnessPubkeyhash(): boolean;
      public isWitnessScripthash(): boolean;
      public isUnknown(): boolean;

      static getHash(
        data: string | Address | Buffer,
        enc?: string,
        network?: Network
      ): Buffer;
      static getType(prefix: number, network: Network): AddressTypeNum;
    }

    export type AddressOptions =
      | { hash: Buffer | string; type: AddressType; version?: number }
      | string;

    export type AddressType = AddressTypeNum | AddressTypeVal;

    export type AddressTypeNum =
      | 0 // PUBKEYHASH
      | 1 // SCRIPTHASH
      | 2; // WITNESS
    export type AddressTypeVal = 'PUBKEYHASH' | 'SCRIPTHASH' | 'WITNESS';
    export type AddressTypeLowerCase = 'pubkeyhash' | 'scripthash' | 'witness';
    export class Block {}

    export class TXMeta {
      tx: TX;
      mtime: number;
      height: number;
      block?: Buffer;
      time: number;
      index: number;
      constructor(options?: Partial<TXMetaOptions>);
      static fromOptions(options: Partial<TXMetaOptions>): TXMeta;
      static fromTX(tx: TX, entry: TXMetaEntry, index: number): TXMeta;
      public inspect(): TXMetaView;
      public format(view?: CoinView): TXMetaView;
      public toJSON(): TXMetaJson;
      public getJSON(
        network?: Network,
        view?: CoinView,
        chainHeight?: number
      ): TXMetaJson;
      static fromJSON(json: TXMetaView): TXMeta;
      getSize(): number;
      toRaw(): Buffer;
      private fromRaw(data: Buffer): TXMeta;
      static fromRaw(data: Buffer, enc: 'hex' | 'null'): TXMeta;
      static isTXMeta(obj: object): boolean;
    }

    interface TXMetaEntry {
      height: number;
      hash: Buffer;
      time: number;
    }

    interface TXMetaView {
      mtime: number;
      height: number;
      block: Buffer | null;
      time: number;
    }

    type TXMetaJson = {
      confirmations: number;
    } & TXMetaView;

    type TXMetaOptions = {
      tx: TX;
      index: number;
    } & TXMetaView;

    export class Coin extends Output {
      version: number;
      height: number;
      coinbase: boolean;
      hash: Buffer;
      index: number;
      script?: Script;
      constructor(options?: Partial<CoinOptions>);
      private clone(): Coin;
      public getDepth(height?: number): number;
      public toKey(): string;
      static fromKey(key: string): Coin;
      rhash(): Buffer;
      txid(): Buffer;
      inspect(): CoinOptions & {
        address: Address | null;
        type: script.common.typesByValLower;
      };
      toJSON(): CoinOptions & { address: Address | null };
      getJSON(
        network: NetworkType,
        minmal?: boolean
      ): CoinOptions & { address: Address | null };
      private fromJSON(json: CoinOptions): Coin;
      getSize(): number;
      toWriter(bw: BufferWriter): BufferWriter;
    }

    export interface CoinOptions {
      version: number;
      height: number;
      value: Amount;
      script: ScriptOptions;
      coinbase: boolean;
      hash: Buffer;
      index: number;
    }

    export class Headers extends AbstractBlock {
      constructor(options: BlockHeaderOpts);
      verifyBody(): true;
      getSize(): 81;
    }

    interface BlockHeaderOpts {
      version: number;
      prevBlock: Buffer;
      merkleRoot: Buffer;
      time: number;
      bits: number;
      nonce: number;
      mutable?: boolean;
    }
    export abstract class AbstractBlock {
      private parseOptions(options: BlockHeaderOpts): any;
      private parseJson(options: BlockHeaderOpts): any;
      public isMemory(): boolean;
      /**
       * Serialize Block headers.
       */
      public toHead();
      private fromHead(data: Buffer): any;
      public writeHead(bw: BufferWriter): any;
      public readHead(br: BufferReader): any;
      public verify(): boolean;
      public verifyPOW(): boolean;
      abstract verifyBody(): boolean;
      public rhash(): Buffer;
      public toInv(): InvItem;
      Buffer;
    }
    export class Input {}

    /**
     * return value of `Input.format()`
     */
    interface InputJson {}

    export class InvItem {}

    export class KeyRing {}

    export class MerkleBlock {}

    export class MTX {
      mutable: true;
      view: CoinView;
      changeIndex: number;
    }

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

    /**
     * result of `Output.getJSON`
     */
    export interface OutputJson {}

    export class TX {
      public version: number;
      public inputs: Input[];
      public outputs: Output[];
      public locktime: number;
      public mutable: boolean;
      private _witness: number;
      constructor(option: TXOption);
      clone(): TX;
      inject(tx: TX): TX;
      refresh(): null;
      createHash(enc?: 'hex'): Buffer;
      witnessHash(enc?: string): Buffer;
      /**
       * This will result to the witness serialization format
       * if witness is present.
       */
      toRaw(): Buffer;
      toNormal(): Buffer;
      toWriter(bw: BufferWriter): BufferWriter;
      toNormalWriter(bw: BufferWriter): BufferWriter;
      private frame(): RawTX;
      getSizes(): RawTX;
      getVirtualSize(): number;
      getSigopsSize(sigops: number): number;
      getWeight(): number;
      getSize(): number;
      getBaseSize(): number;
      hasWitness(): boolean;
      signatureHash(
        index: number,
        prev: Script,
        value: Amount,
        type: script.common.hashType,
        version: 0 | 1 // 0 for legacy, 1 for segwit
      ): Buffer;
      private signatureHashV0(
        index: number,
        prev: Script,
        type: script.common.hashType
      ): Buffer;
      private hashSize(...args: any[]): number;
      private signatureHashV1(
        index: number,
        prev: Script,
        value: Amount,
        type: script.common.hashType
      ): Buffer;
      public checksig(
        index: number,
        prev: Script,
        value: Amount,
        sig: Buffer,
        key: Buffer,
        version: number
      ): boolean;
      signature(
        index: number,
        prev: Script,
        value: Amount,
        key: Buffer,
        type: script.common.hashType,
        version: 0 | 1
      );
      /**
       * Verify all transaction inputs
       * @param view
       * @param flags
       */
      check(view: CoinView, flags?: script.common.flags): void;
      checkInput(
        index: number,
        coin: Coin | Output,
        flags?: script.common.flags
      ): void;
      checkAsync(
        view: CoinView,
        flags?: script.common.flags,
        pool?: WorkerPool
      ): Promise<void>;
      checkInputAsync(
        index: number,
        coin: Coin | Output,
        flags?: script.common.flags,
        pool?: WorkerPool
      ): Promise<void>;
      /**
       * Method starts from `verify` is almost same with the one with `check`
       * Only difference is that it wont throw error.
       */
      verify(view: CoinView, flags?: script.common.flags): boolean;
      verifyInput(
        index: number,
        coin: Coin | Output,
        flags?: script.common.flags
      ): boolean;
      verifyAsync(
        view: CoinView,
        flags?: script.common.flags,
        pool?: WorkerPool
      ): Promise<boolean>;
      verifyInputAsync(
        index: number,
        coin: Coin | Output,
        flags?: script.common.flags,
        pool?: WorkerPool
      ): Promise<boolean>;
      isCoinbase(): boolean;
      isRBF(): boolean;
      getFee(view: CoinView): Amount;
      getInputValue(view: CoinView): Amount;
      getOutputValue(): Amount;
      getInputAddress(view: CoinView): Address[];
      getOutputAddresses(): Address[];
      getAddresses(view?: CoinView): Address[];
      getHashes(view: CoinView | null, enc?: 'hex'): Buffer[];
      hasCoins(view: CoinView): boolean;
      isFinal(height: number, time: number): boolean;
      verifyLocktime(index: number, predicate: number): boolean;
      verifySequence(index: number, predicate: number): boolean;
      private getLegacySigops(): number;
      private getScripthashSigops(view: CoinView): number;
      private getWitnessSigops(view: CoinView): number;
      private getSigopsCost(view: CoinView, flags: script.common.flags): number;
      public getSigops(view: CoinView, flags?: script.common.flags): number;
      /**
       * score will be 0 if it is valid
       * it will be 10 if `input.prevout` is null
       * otherwise 100
       * @retruns - 1. result, 2. reason why it's not sane, 3, score
       */
      public isSane(): [boolean, string, number];
      /**
       * Non-contextual checks to determine whether the transaction has all
       * standard output script types and standard input script size with only pushdatas
       * in the code.
       * Will mostly verify coin and output values.
       */
      public isStandard(): [boolean, string, number];
      /**
       * if p2sh, then check redeem script has small sigops enough
       * Otherwise, it will return true in we have coin and not unknown
       * @param view
       */
      public hasStandardInputs(view: CoinView): boolean;
      public hasStandardWitness(view: CoinView): boolean;
      /**
       * Perform contextual checks to verify input, output, and fee.
       * Difference to `verityInput` is that it is contextual.
       * Note this function is consensus critical
       * @param view
       * @param height
       */
      public verifyInputs(view: CoinView, height: number): boolean;
      /**
       * Perform contextual check of tx input
       * This function is consensus critical
       * e.g. Coinbase maturity, fee is not negative, etc.
       * @param view
       * @param height
       */
      public checkInputs(
        view: CoinView,
        height: number
      ): [number, string, number];
      /**
       * Calculate the modified size ot the transaction.
       * This is used in the mempool for calculating priority.
       * @param size
       */
      public getModifiedSize(size?: number): number;
      public getPriority(view: CoinView, height: number, size?: number): number;
      /**
       * Calculate the sum of the inputs on chain.
       * @param view
       */
      public getChainValue(view: CoinView): number;
      /**
       * Test if priority is hight enough.
       * Priority itself is historical thing, so likely
       * we don't have to bother with this method.
       * @param view
       * @param height
       * @param size
       */
      public isFree(view: CoinView, height?: number, size?: number): boolean;
      /**
       * Calculate minimum fee in order for the transaction to be relayable.
       * @param size
       * @param rate
       */
      public getMinFee(size?: number, rate?: Rate): Amount;
      /**
       * Almost exactly same with the `getMinFee`,
       * But it will round the result to the nearest kilobyte.
       * @param size
       * @param rate
       */
      public getRoundFee(size?: number, rate?: Rate): Amount;
      /**
       * Calculate the transaction's fee rate.
       * @param view
       * @param size
       */
      public getRate(view: CoinView, size?: number): Rate;
      /**
       * get all previous outpoint hashes (i.e. txid)
       */
      public getPrevout(): Buffer[];
      /**
       * Test this transaction is included in the filter.
       * This will update the filter according to `filter.update` field
       * @param filter
       */
      public isWatched(filter: BloomFilter): boolean;
      /**
       * Same with txid
       */
      public rhash(): Buffer;
      /**
       * Witness hash in little endian.
       */
      public rwhash(): Buffer;
      public txid(): Buffer;
      public toInv(): InvItem;
      /**
       * Same with `this.format()`.
       */
      public inspect(): TXFormat;
      public format(
        view?: CoinView,
        entry?: ChainEntry,
        index?: number
      ): TXFormat;
      /**
       * Same with `getJSON()`
       */
      public toJSON(): TXJsonResult;
      public getJSON(): TXJsonResult;
      private fromJSON(json: TXJson): TX;
      static fromJSON(json: TXJson): TX;
      /**
       * Automatically detects if it is witness serialization or not.
       */
      static fromRaw(data: Buffer | string, enc?: 'hex'): TX;
      /**
       * Automatically detects if it is witness serialization or not.
       */
      static fromReader(br: BufferReader): TX;
      static isTX(obj: object): boolean;
    }

    class RawTX {
      data: null | Buffer;
      size: number;
      witness: number;
    }
    export interface TXOption {
      version?: number;
      input?: number;
      outputs?: Output[];
      locktime?: number;
    }
    /**
     * result Object of tx.inspect()
     */
    export interface TXFormat {
      hash: Buffer; // txid
      witnessHash: Buffer;
      size: number;
      virtualSize: number;
      value: Amount;
      // ----- these  exists only when CoinView is present.
      fee?: Amount;
      rate?: Amount;
      // ----------

      minFee: Amount;
      // ----- these exists only when ChainEntry is present.
      height?: number;
      block?: Buffer; // block hash
      time?: number;
      date?: number;
      // -----------
      index: number;
      version: number;
      inputs: InputJson[];
      outputs: Output[];
      locktime: number;
    }
    /**
     * result of tx.toJSON()
     */
    export type TXJsonResult = {
      hash: Buffer;
      witnessHash: Buffer;
      fee?: Amount;
      rate?: Amount;
      mtime: number; // returns now
      height?: number;
      block?: Buffer;
      time?: number;
      date?: number;
      hex: string;
    } & TXJson;
    /** value required for TX.fromJSON() */
    export interface TXJson {
      version: number;
      inputs: InputJson[];
      outputs: OutputJson[];
      locktime: number;
    }
  }

  export class Address extends primitives.Address {}
  export class Block extends primitives.Block {}
  export class Coin extends primitives.Coin {}
  export class Headers extends primitives.Headers {}
  export class Input extends primitives.Input {}
  export class InvItem extends primitives.InvItem {}
  export class KeyRing extends primitives.KeyRing {}
  export class MerkleBlock extends primitives.MerkleBlock {}
  export class MTX extends primitives.MTX {}
  export class Outpoint extends primitives.Outpoint {}
  export class Output extends primitives.Output {}
  export class TX extends primitives.TX {}

  export namespace protocol {
    export interface consensus {}
    export class Network {
      type: NetworkType;
      /**
       * url for seed node
       */
      seeds: string;
      magic: number;
      port: number;
      checkPointMap: { [key: string]: string };
      lastCheckpoint: number;
      halvingInterval: number;
      genesis: primitives.BlockHeaderOpts & { hash: string };
      genesisBlock: string;
      pow: POW;
      block: BlockConstants;
      /**
       * Map of historical blocks which create duplicate tx hashes.
       */
      bip30: { [key: string]: string };
      activationThreshold: number;
      minerWindow: number;
      deployments: DeployMents;
      deploys: Deploy[];
      unknownBits: number;
      keyPrefix: KeyPrefix;
      addressPrefix: AddressPrefix;
      /**
       * default value for whether the mempool
       * accepts non-standard tx.
       */
      requireStandard: boolean;
      rpcPort: number;
      walletPort: number;
      minRelay: number;
      feeRate: Rate;
      maxFeeRate: Rate;
      selfConnect: boolean;
      requestMempool: boolean;
      time: TimeData;
      public checkpoints: { hash: string; height: number }[];
      constructor(options: Partial<NetworkOptions>);
      static get(type: NetworkType): Network;
      private init(): void;
      /**
       * Get deployment info by bit index.
       * @param bit
       */
      public byBit(bit: number): Deploy;
      /**
       * get network adjusted time.
       */
      public now(): number;
      /**
       * Get network adjusted time in milliseconds.
       */
      public ms(): number;
      static create(): Network;
      /**
       * Set the default network.
       * @param type
       */
      static set(type: NetworkType): Network;
      static get(type: NetworkType): Network;
      private static by(
        value: object,
        compare: Function,
        network: Network | null,
        name: string
      );
      static fromMagic(value, network): Network;
      static fromWIF(prefix, network): Network;
      /**
       * from xpubkey prefix
       * @param prefix
       * @param network
       */
      static fromPublic(prefix: number, network?: Network): Network;
      static fromPrivate(prefix: number, network?: Network): Network;
      static fromPublic58(prefix: string, network?: Network): Network;
      static fromPrivate58(prefix: string, network?: Network): Network;
      static fromAddress(prefix: number, network?: Network): Network;
      static fromBech32(prefix: number, network?: Network): Network;
      toString(): NetworkType;
    }

    export interface NetworkOptions {
      type: NetworkType;
      /**
       * url for seed node
       */
      seeds: string;
      magic: number;
      port: number;
      checkPointMap: { [key: string]: string };
      lastCheckpoint: number;
      halvingInterval: number;
      genesis: primitives.BlockHeaderOpts & { hash: string };
      genesisBlock: string;
      pow: POW;
      block: BlockConstants;
      /**
       * Map of historical blocks which create duplicate tx hashes.
       */
      bip30: { [key: string]: string };
      activationThreshold: number;
      minerWindow: number;
      deployments: DeployMents;
      deploys: Deploy[];
      unknownBits: number;
      keyPrefix: KeyPrefix;
      addressPrefix: AddressPrefix;
      /**
       * default value for whether the mempool
       * accepts non-standard tx.
       */
      requireStandard: boolean;
      rpcPort: number;
      walletPort: number;
      minRelay: number;
      feeRate: Rate;
      maxFeeRate: Rate;
      selfConnect: boolean;
      requestMempool: boolean;
    }

    export interface TimeData {}

    interface AddressPrefix {
      pubkeyhash: number;
      scripthash: number;
      witnesspubkeyhash: number;
      witnessscripthash: number;
      bech32: string;
    }

    interface KeyPrefix {
      privkey: number;
      xpubkey: number;
      xpubkey58: string;
      xprivkey58: string;
      coinType: number;
    }

    interface DeployMents {
      [key: string]: Deploy;
    }

    interface Deploy {
      name: 'csv';
      bit: number;
      startTime: number;
      timeout: number;
      threshold: number;
      window: number;
      required: boolean;
      force: boolean;
    }
    /**
     * Constants of blockchain itself.
     * It differs among network parameters.
     */
    interface BlockConstants {
      bip34height: number;
      bip34hash: string;
      bip65height: number;
      bip65hash: string;
      bip66height: number;
      bip66hash: string;
      /**
       * Safe height to start pruning
       */
      pruneAfterHeight: number;
      /**
       * safe number to
       */
      keepBlocks: number;
      /**
       * Used for the time delta to determine whether the chain is synced
       */
      maxTipAge: number;
      /**
       * Height at which block processing is slow enough that we can output
       * logs without spamming
       */
      slowHeight: number;
    }
    interface POW {
      limit: BN;
      bits: number; // compact pow limit.
      chainwork: BN;
      targetTimespan;
      targetSpacing: number;
      retargetInterval: number;
      targetRest: boolean;
      noRetargeting: boolean;
    }

    export interface networks {
      type: NetworkType;
    }

    export interface policy {}
  }

  export class Network extends protocol.Network {}

  export type NetworkType = 'main' | 'testnet' | 'regtest' | 'simnet';

  export type consensus = protocol.consensus;
  export type networks = protocol.networks;
  export type policy = protocol.policy;
  export namespace utils {
    export interface util {}
  }

  export type util = utils.util;

  /// ------ worker ------

  export namespace workers {
    export class WorkerPool {
      enabled: boolean;
      size: number;
      timeout: number;
      file: string;
      children: Map<number, Worker>;
      uid: number;
      constructor(options: WorkerPoolOptions);
      open(): Promise<void>;
      close(): Promise<void>;
      /**
       * Spawn new worker, if one with the `id` already exists,
       * then replace with the new one.
       * @param id
       */
      spawn(id: number): Worker;
      /**
       * Allocate a new worker. consider `size` and make sure
       * it wont make too much worker.
       */
      alloc(): Worker;
      sendEvent(...args: any[]): boolean;
      /**
       * Destroy wll workers.
       */
      destroy(): void;
      execute(packet: Packet, timeout: number): Promise<void>;
      /**
       * Execute the tx check jobs
       * @param tx
       * @param view
       * @param flags
       */
      check(tx: TX, view?: CoinView, flags?: number): Promise<null>;

      sign(mtx: MTX, ring?: KeyRing[], type?: SighashType): Promise<null>;

      checkInput(
        tx: TX,
        index: number,
        coin?: Coin | Output,
        flags?: number
      ): Promise<void>;

      signInput(
        tx: MTX,
        index: number,
        coin?: Coin | Output,
        keyring?: KeyRing,
        type?: SighashType
      ): Promise<void>;

      ecVerify(msg: Buffer, sig: Buffer, key: Buffer): Promise<number>;
      ecSign(msg: Buffer, key: Buffer): Promise<number>;
      mine(
        data: Buffer,
        target?: Buffer,
        min?: number,
        max?: number
      ): Promise<number>;

      script(
        passwd: Buffer,
        salt?: Buffer,
        N?: number,
        r?: number,
        p?: number,
        len?: number
      ): Promise<any>;
    }
    /**
     * Unit for workers to communicate with master.
     */
    abstract class Packet {
      public id: number;
      public cmd: number;
      constructor();
      abstract getSize(): number;
      abstract toWriter(): BufferWriter;
      abstract fromRaw(data: Buffer): any;
      static fromRaw(data): any;
    }

    class CheckPacket implements Packet {
      public id: number;
      public cmd: 5;
      constructor(tx?: TX, view?: CoinView, flags?: number);
      getSize(): number;
      toWriter(): BufferWriter;
      fromRaw(data: Buffer): CheckPacket;
      static fromRaw(data): CheckPacket;
    }

    class SignPacket implements Packet {
      public id: number;
      public cmd: 7;
      constructor(tx?: MTX, rings?: KeyRing[], type?: SighashType);
      getSize(): number;
      toWriter(): BufferWriter;
      fromRaw(data: Buffer): SignPacket;
      static fromRaw(data): SignPacket;
    }

    interface WorkerPoolOptions {
      enabled: boolean;
      /**
       * Number of cpu core to use.
       * Default is all available cors in machine.
       */
      size?: number;
      timeout?: number;
      /**
       * defaults to `bcoin/lib/workers/worker.js`
       * You can configure this by `BCOIN_WORKER_FILE`
       */
      file?: string;
    }

    interface Worker {}
    export class Framer {}
    export class jobs {}
    export class packets {}

    export class Parser {}
  }

  export class WorkerPool extends workers.WorkerPool {}

  export interface pkg {
    readonly version: string;
    readonly url: string;
  }
}
