// Type definitions for bcoin 1.0.2
// Project: https://github.com/bcoin-org/bweb
// Definitions by: Joe Miyamoto <joemphilips@gmail.com>

declare module 'bcoin' {
  import { EventEmitter } from 'events';
  import Logger from 'blgr';
  import bweb from 'bweb';
  import bdb from 'bdb';
  import bmutex from 'bmutex';
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
    export abstract class Node {
      http?: bweb.Server;
    }
    export class FullNode implements Node {}

    export class SPVNode implements Node {}
  }

  export type Node = node.Node;

  export type FullNode = node.FullNode;

  export type SPVNode = node.SPVNode;

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

    export interface networks {}

    export interface policy {}
  }

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
    export class Wallet extends EventEmitter {
      public wdb: WalletDB;
      public db: bdb.DB;
      public network: Network;
      public logger: Logger;
      public wid: WID;
      public id: string;
      public watchOnly: boolean;
      public accountDepth: number;
      public token: Buffer;
      public tokenDepth: number;
      public master: MasterKey;
      public txdb: TXDB;
      private writeLock: bmutex.Lock;
      private fundLock: bmutex.Lock;
      constructor(wdb: WalletDB, options?: Partial<WalletOptions>);
      [key: string]: any;
    }

    export interface WalletOptions {}
    export class TXDB {}
    export class MasterKey {}
    export class Account {}
    export class WalletKey {}
    export class Path {}
    export class WalletDB {}
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
