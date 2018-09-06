// Type definitions for bcoin 1.0.2
// Project: https://github.com/bcoin-org/bcoin
// Definitions by: Joe Miyamoto <joemphilips@gmail.com>
declare module 'bcoin' {
  import { BloomFilter } from 'bfilter';
  import { BufferWriter, BufferReader } from 'bufio';
  import { I64 } from 'n64';

  export namespace script {
    export namespace common {
      export type opcodes = {
        // Push
        OP_0: 0x00;

        OP_PUSHDATA1: 0x4c;
        OP_PUSHDATA2: 0x4d;
        OP_PUSHDATA4: 0x4e;

        OP_1NEGATE: 0x4f;

        OP_RESERVED: 0x50;

        OP_1: 0x51;
        OP_2: 0x52;
        OP_3: 0x53;
        OP_4: 0x54;
        OP_5: 0x55;
        OP_6: 0x56;
        OP_7: 0x57;
        OP_8: 0x58;
        OP_9: 0x59;
        OP_10: 0x5a;
        OP_11: 0x5b;
        OP_12: 0x5c;
        OP_13: 0x5d;
        OP_14: 0x5e;
        OP_15: 0x5f;
        OP_16: 0x60;

        // Control
        OP_NOP: 0x61;
        OP_VER: 0x62;
        OP_IF: 0x63;
        OP_NOTIF: 0x64;
        OP_VERIF: 0x65;
        OP_VERNOTIF: 0x66;
        OP_ELSE: 0x67;
        OP_ENDIF: 0x68;
        OP_VERIFY: 0x69;
        OP_RETURN: 0x6a;

        // Stack
        OP_TOALTSTACK: 0x6b;
        OP_FROMALTSTACK: 0x6c;
        OP_2DROP: 0x6d;
        OP_2DUP: 0x6e;
        OP_3DUP: 0x6f;
        OP_2OVER: 0x70;
        OP_2ROT: 0x71;
        OP_2SWAP: 0x72;
        OP_IFDUP: 0x73;
        OP_DEPTH: 0x74;
        OP_DROP: 0x75;
        OP_DUP: 0x76;
        OP_NIP: 0x77;
        OP_OVER: 0x78;
        OP_PICK: 0x79;
        OP_ROLL: 0x7a;
        OP_ROT: 0x7b;
        OP_SWAP: 0x7c;
        OP_TUCK: 0x7d;

        // Splice
        OP_CAT: 0x7e;
        OP_SUBSTR: 0x7f;
        OP_LEFT: 0x80;
        OP_RIGHT: 0x81;
        OP_SIZE: 0x82;

        // Bit
        OP_INVERT: 0x83;
        OP_AND: 0x84;
        OP_OR: 0x85;
        OP_XOR: 0x86;
        OP_EQUAL: 0x87;
        OP_EQUALVERIFY: 0x88;
        OP_RESERVED1: 0x89;
        OP_RESERVED2: 0x8a;

        // Numeric
        OP_1ADD: 0x8b;
        OP_1SUB: 0x8c;
        OP_2MUL: 0x8d;
        OP_2DIV: 0x8e;
        OP_NEGATE: 0x8f;
        OP_ABS: 0x90;
        OP_NOT: 0x91;
        OP_0NOTEQUAL: 0x92;
        OP_ADD: 0x93;
        OP_SUB: 0x94;
        OP_MUL: 0x95;
        OP_DIV: 0x96;
        OP_MOD: 0x97;
        OP_LSHIFT: 0x98;
        OP_RSHIFT: 0x99;
        OP_BOOLAND: 0x9a;
        OP_BOOLOR: 0x9b;
        OP_NUMEQUAL: 0x9c;
        OP_NUMEQUALVERIFY: 0x9d;
        OP_NUMNOTEQUAL: 0x9e;
        OP_LESSTHAN: 0x9f;
        OP_GREATERTHAN: 0xa0;
        OP_LESSTHANOREQUAL: 0xa1;
        OP_GREATERTHANOREQUAL: 0xa2;
        OP_MIN: 0xa3;
        OP_MAX: 0xa4;
        OP_WITHIN: 0xa5;

        // Crypto
        OP_RIPEMD160: 0xa6;
        OP_SHA1: 0xa7;
        OP_SHA256: 0xa8;
        OP_HASH160: 0xa9;
        OP_HASH256: 0xaa;
        OP_CODESEPARATOR: 0xab;
        OP_CHECKSIG: 0xac;
        OP_CHECKSIGVERIFY: 0xad;
        OP_CHECKMULTISIG: 0xae;
        OP_CHECKMULTISIGVERIFY: 0xaf;

        // Expansion
        OP_NOP1: 0xb0;
        OP_CHECKLOCKTIMEVERIFY: 0xb1;
        OP_CHECKSEQUENCEVERIFY: 0xb2;
        OP_NOP4: 0xb3;
        OP_NOP5: 0xb4;
        OP_NOP6: 0xb5;
        OP_NOP7: 0xb6;
        OP_NOP8: 0xb7;
        OP_NOP9: 0xb8;
        OP_NOP10: 0xb9;

        // Custom
        OP_INVALIDOPCODE: 0xff;
      };

      export type SmallNumOp =
        | 0x52
        | 0x53
        | 0x54
        | 0x55
        | 0x56
        | 0x57
        | 0x58
        | 0x59
        | 0x5a
        | 0x5b
        | 0x5c
        | 0x5d
        | 0x5e
        | 0x5f
        | 0x60;
      export type opcodeNum =
        | 0x00
        | 0x4c
        | 0x4d
        | 0x4e
        | 0x4f
        | 0x50
        | 0x51
        | 0x52
        | 0x53
        | 0x54
        | 0x55
        | 0x56
        | 0x57
        | 0x58
        | 0x59
        | 0x5a
        | 0x5b
        | 0x5c
        | 0x5d
        | 0x5e
        | 0x5f
        | 0x60

        // control
        | 0x61
        | 0x62
        | 0x63
        | 0x64
        | 0x65
        | 0x66
        | 0x67
        | 0x68
        | 0x69
        | 0x6a

        // stack
        | 0x6b
        | 0x6c
        | 0x6d
        | 0x6e
        | 0x6f
        | 0x70
        | 0x71
        | 0x72
        | 0x73
        | 0x74
        | 0x75
        | 0x76
        | 0x77
        | 0x78
        | 0x79
        | 0x7a
        | 0x7b
        | 0x7c
        | 0x7d
        | 0x7e
        | 0x7f
        | 0x80
        | 0x81
        | 0x82
        | 0x83
        | 0x84
        | 0x85
        | 0x86
        | 0x87
        | 0x88
        | 0x89
        | 0x8a

        // arithmetic
        | 0x8b
        | 0x8c
        | 0x8d
        | 0x8e
        | 0x8f
        | 0x90
        | 0x91
        | 0x92
        | 0x93
        | 0x94
        | 0x95
        | 0x96
        | 0x97
        | 0x98
        | 0x99
        | 0x9a
        | 0x9b
        | 0x9c
        | 0x9d
        | 0x9e
        | 0x9f
        | 0xa0
        | 0xa1
        | 0xa2
        | 0xa3
        | 0xa4
        | 0xa5

        // crypto
        | 0xa6
        | 0xa7
        | 0xa8
        | 0xa9
        | 0xaa
        | 0xab
        | 0xac
        | 0xad
        | 0xae
        | 0xaf

        // Expansion
        | 0xb0
        | 0xb1
        | 0xb2
        | 0xb3
        | 0xb4
        | 0xb5
        | 0xb6
        | 0xb7
        | 0xb8
        | 0xb9

        // custom
        | 0xff;

      export type opcodesByVal =
        | 'OP_0' // 0x00
        | 'OP_PUSHDATA1' // 0x4d
        | 'OP_PUSHDATA2' // 0x4e
        | 'OP_PUSHDATA4' // 0x4f
        | 'OP_1NEGATE'
        | 'OP_RESERVED'
        | 'OP_1'
        | 'OP_2'
        | 'OP_3'
        | 'OP_4'
        | 'OP_5'
        | 'OP_6'
        | 'OP_7'
        | 'OP_8'
        | 'OP_9'
        | 'OP_10'
        | 'OP_11'
        | 'OP_12'
        | 'OP_13'
        | 'OP_14'
        | 'OP_15'
        | 'OP_16'

        // Control
        | 'OP_NOP'
        | 'OP_VER'
        | 'OP_IF'
        | 'OP_NOTIF'
        | 'OP_VERIF'
        | 'OP_VERNOTIF'
        | 'OP_ELSE'
        | 'OP_ENDIF'
        | 'OP_VERIFY'
        | 'OP_RETURN'

        // Stack
        | 'OP_TOALTSTACK'
        | 'OP_FROMALTSTACK'
        | 'OP_2DROP'
        | 'OP_2DUP'
        | 'OP_3DUP'
        | 'OP_2OVER'
        | 'OP_2ROT'
        | 'OP_2SWAP'
        | 'OP_IFDUP'
        | 'OP_DEPTH'
        | 'OP_DROP'
        | 'OP_DUP'
        | 'OP_NIP'
        | 'OP_OVER'
        | 'OP_PICK'
        | 'OP_ROLL'
        | 'OP_ROT'
        | 'OP_SWAP'
        | 'OP_TUCK'

        // Slice
        | 'OP_CAT'
        | 'OP_SUBSTR'
        | 'OP_LEFT'
        | 'OP_RIGHT'
        | 'OP_SIZE'
        | 'OP_INVERT'
        | 'OP_AND'
        | 'OP_OR'
        | 'OP_XOR'
        | 'OP_EQUAL'
        | 'OP_EQUALVERIFY'
        | 'OP_RESERVED1'
        | 'OP_RESERVED2'

        // arithmetic
        | 'OP_1ADD'
        | 'OP_1SUB'
        | 'OP_2MUL'
        | 'OP_2DIV'
        | 'OP_NEGATE'
        | 'OP_ABS'
        | 'OP_NOT'
        | 'OP_0NOTEQUAL'
        | 'OP_ADD'
        | 'OP_SUB'
        | 'OP_MUL'
        | 'OP_DIV'
        | 'OP_MOD'
        | 'OP_LSHIFT'
        | 'OP_RSHIFT'
        | 'OP_BOOLAND'
        | 'OP_BOOLOR'
        | 'OP_NUMEQUAL'
        | 'OP_NUMEQUALVERIFY'
        | 'OP_NUMNOTEQUAL'
        | 'OP_LESSTHAN'
        | 'OP_GREATERTHAN'
        | 'OP_LESSTHANOREQUAL'
        | 'OP_GREATERTHANOREQUAL'
        | 'OP_MIN'
        | 'OP_MAX'
        | 'OP_WITHIN'

        // cryypto
        | 'OP_RIPEMD160'
        | 'OP_SHA1'
        | 'OP_SHA256'
        | 'OP_HASH160'
        | 'OP_HASH256'
        | 'OP_CODESEPARATOR'
        | 'OP_CHECKSIG'
        | 'OP_CHECKSIGVERIFY'
        | 'OP_CHECKMULTISIG'
        | 'OP_CHECKMULTISIGVERIFY'

        // expansion
        | 'OP_NOP1'
        | 'OP_CHECKLOCKTIMEVERIFY'
        | 'OP_CHECKSEQUENCEVERIFY'
        | 'OP_NOP4'
        | 'OP_NOP5'
        | 'OP_NOP6'
        | 'OP_NOP7'
        | 'OP_NOP8'
        | 'OP_NOP9'
        | 'OP_NOP10'

        // custom
        | 'OP_INVALIDOPCODE';

      export type opcodesByValShort =
        | '0' // 0x00
        | 'PUSHDATA1' // 0x4d
        | 'PUSHDATA2' // 0x4e
        | 'PUSHDATA4' // 0x4f
        | '1NEGATE'
        | 'RESERVED'
        | '1'
        | '2'
        | '3'
        | '4'
        | '5'
        | '6'
        | '7'
        | '8'
        | '9'
        | '10'
        | '11'
        | '12'
        | '13'
        | '14'
        | '15'
        | '16'

        // Control
        | 'NOP'
        | 'VER'
        | 'IF'
        | 'NOTIF'
        | 'VERIF'
        | 'VERNOTIF'
        | 'ELSE'
        | 'ENDIF'
        | 'VERIFY'
        | 'RETURN'

        // Stack
        | 'TOALTSTACK'
        | 'FROMALTSTACK'
        | '2DROP'
        | '2DUP'
        | '3DUP'
        | '2OVER'
        | '2ROT'
        | '2SWAP'
        | 'IFDUP'
        | 'DEPTH'
        | 'DROP'
        | 'DUP'
        | 'NIP'
        | 'OVER'
        | 'PICK'
        | 'ROLL'
        | 'ROT'
        | 'SWAP'
        | 'TUCK'

        // Slice
        | 'CAT'
        | 'SUBSTR'
        | 'LEFT'
        | 'RIGHT'
        | 'SIZE'
        | 'INVERT'
        | 'AND'
        | 'OR'
        | 'XOR'
        | 'EQUAL'
        | 'EQUALVERIFY'
        | 'RESERVED1'
        | 'RESERVED2'

        // arithmetic
        | '1ADD'
        | '1SUB'
        | '2MUL'
        | '2DIV'
        | 'NEGATE'
        | 'ABS'
        | 'NOT'
        | '0NOTEQUAL'
        | 'ADD'
        | 'SUB'
        | 'MUL'
        | 'DIV'
        | 'MOD'
        | 'LSHIFT'
        | 'RSHIFT'
        | 'BOOLAND'
        | 'BOOLOR'
        | 'NUMEQUAL'
        | 'NUMEQUALVERIFY'
        | 'NUMNOTEQUAL'
        | 'LESSTHAN'
        | 'GREATERTHAN'
        | 'LESSTHANOREQUAL'
        | 'GREATERTHANOREQUAL'
        | 'MIN'
        | 'MAX'
        | 'WITHIN'

        // crypto
        | 'RIPEMD160'
        | 'SHA1'
        | 'SHA256'
        | 'HASH160'
        | 'HASH256'
        | 'CODESEPARATOR'
        | 'CHECKSIG'
        | 'CHECKSIGVERIFY'
        | 'CHECKMULTISIG'
        | 'CHECKMULTISIGVERIFY'

        // Expansion
        | 'NOP1'
        | 'CHECKLOCKTIMEVERIFY'
        | 'CHECKSEQUENCEVERIFY'
        | 'NOP4'
        | 'NOP5'
        | 'NOP6'
        | 'NOP7'
        | 'NOP8'
        | 'NOP9'
        | 'NOP10'

        // Custom
        | 'INVALIDOPCODE';

      export enum flags {
        VERIFY_NONE = 0,
        VERIFY_P2SH = 1,
        VERIFY_STRICTENC = 2,
        VERIFY_DERSIG = 4,
        VERIFY_LOW_S = 8,
        VERIFY_NULLDUMMY = 16,
        VERIFY_SIGPUSHONLY = 32,
        VERIFY_MINIMALDATA = 64,
        VERIFY_DISCOURAGE_UPGRADABLE_NOPS = 128,
        VERIFY_CLEANSTACK = 256,
        VERIFY_CHECKLOCKTIMEVERIFY = 512,
        VERIFY_CHECKSEQUENCEVERIFY = 1024,
        VERIFY_WITNESS = 2048,
        VERIFY_DISCOURAGE_UPGRADABLE_WITNESS_PROGRAM = 4096,
        VERIFY_MINIMALIF = 8192,
        VERIFY_NULLFAIL = 16384,
        VERIFY_WITNESS_PUBKEYTYPE = 32768,
        /**
         * Consensus verify flags ... used for block validation.
         */
        MANDATORY_VERIFY_FLAGS = 1,
        /**
         * Used for mempool validation.
         */
        STANDARD_VERIFY_FLAGS = 65503,
        /**
         * `STANDARD_VERIFY_FLAGS & ~MANDATORY_VERIFY_FLAGS`
        /**
         */
        ONLY_STANDARD_VERIFY_FLAGS = 65502
      }

      export enum hashType {
        ALL = 1,
        NONE = 2,
        SINGLE = 3,
        ANYONECANPAY = 0x08
      }

      export type hashTypeByVal = {
        1: 'ALL';
        2: 'NONE';
        3: 'SINGLE';
        0x80: 'ANYONECANPAY';
      };

      /**
       * output script types
       */
      export enum types {
        NONSTANDARD = 0,
        PUBKEY = 1,
        PUBKEYHASH = 2,
        SCRIPTHASH = 3,
        MULTISIG = 4,
        NULLDATA = 5,
        WITNESSMALFORMED = 0x80,
        WITNESSSCRIPTHASH = 0x81,
        WITNESSPUBKEYHASH = 0x82
      }

      export type typesByVal = {
        0: 'NONSTANDARD';
        1: 'PUBKEY';
        2: 'PUBKEYHASH';
        3: 'SCRIPTHASH';
        4: 'MULTISIG';
        5: 'NULLDATA';
        0x80: 'WITNESSMALFORMED';
        0x81: 'WITNESSSCRIPTHASH';
        0x82: 'WITNESSPUBKEYHASH';
      };

      export type typesByValLower =
        | 'nonstandard'
        | 'pubkey'
        | 'pubkeyhash'
        | 'scripthash'
        | 'multisig'
        | 'nulldata'
        | 'witnessmalformed'
        | 'witnessscripthash'
        | 'witnesspubkeyhash';

      /**
       * check a signature is it holds valid sighash type or not.
       */
      export type isHashType = (sig: Buffer) => boolean;
      export type isLowDER = (sig: Buffer) => boolean;
      export type isKeyEncoding = (key: Buffer) => boolean;
      export type isCompressedEncoding = (key: Buffer) => boolean;
      export type isSignatureEncoding = (sig: Buffer) => boolean;
    }
    export class Opcode {
      constructor(value?: number, data?: Buffer);
      /**
       * Test wheter a pushdata abides by minimaldata.
       */
      isMinimal(): boolean;
      isDisabled(): boolean;
      isBranch(): boolean;
      eauals(op: Opcode): boolean;
      toOp(): number;
      toData(): Buffer | null;
      toLength(): number; // return length in byte
      /**
       * Convert and _cast_ opcode to data push
       */
      toPush(): Buffer | null;
      toString(enc?: string): Buffer | null;
      toSmall(): script.common.SmallNumOp;
      toNum(minimal?: boolean, limit?: number): ScriptNum | null;
      toInt(minimal?: boolean, limit?: number): number;
      toBool(): boolean;
      toSymbol(): string;
      getSize(): number;
      toWriter(bw: BufferWriter): BufferWriter;
      toRaw(): Buffer;
      toFormat(): string;
      toASM(decode?: boolean): common.opcodesByVal | '[error]' | 'OP_UNKNOWN';
      static fromOp(op: common.opcodeNum): Opcode;
      static fromData(data: Buffer): Opcode;
      static fromPush(data: Buffer): Opcode;
      static fromString(str: common.opcodesByVal): Opcode;
      static fromSmall(num: number): Opcode;
      static fromNum(num: ScriptNum): Opcode;
      static fromInt(num: number): Opcode;
      static fromBool(value: boolean): Opcode;
      static fromSymbol(
        name: common.opcodesByVal | common.opcodesByValShort
      ): Opcode;
      static fromReader(br: BufferReader): Opcode;
      static fromRaw(data: Buffer): Opcode;
      static isOpcode(obj: object): boolean;
    }

    /**
     * Witness Program
     */
    export class Program {
      version: number;
      data: Buffer;
      constructor(version: number, data: Buffer);
      getType(): common.types;
      isUnknown(): boolean;
      isMalformed(): boolean;
      inspect(): string;
    }

    export class Script {
      static opcodes: common.opcodes;
      static opcodesByVal: common.opcodesByVal;
      static flags: common.flags;
      static hashType: common.hashType;
      static hashTypeByVal: common.hashTypeByVal;
      static types: common.types;
      static typesByVal: common.typesByVal;
      raw: Buffer;
      code: Opcode[];
      length: number;
      constructor(
        options?: Buffer | Opcode[] | { code: Opcode[]; [key: string]: any }
      );
      static fromOptions(options: {
        code: Opcode[];
        [key: string]: any;
      }): Script;
      values(): Iterator<Opcode>;
      entries(): Iterator<[number, Opcode]>;
      toArray(): Array<Opcode>;
      fromArray(code: Opcode[]): Script;
      static fromArray(code: Opcode[]): Script;

      /**
       * Convert script to stack items
       */
      toItems(): Buffer[];
      private fromItems(buffer: Buffer[]): Script;
      static fromItems(items: Buffer[]): Script;
      toStack(): Stack;
      fromStack(): Script;
      static fromStack(stack: Stack): Script;
      public clone(): Script;
      private inject(script: Script): Script;
      public equals(script: Script): boolean;
      compare(script: Script): number;
      clear(): Script;
      inspect(): string;
      private toString(): string;
      /**
       * Format the script as bitcoind asm
       * @param decode - try to decode hash types
       */
      toASM(decode?: boolean): string;

      /**
       * Re-encode the script internally.
       * Useful if you changed something manually in the `code` array.
       */
      compile(): Script;
      toWriter(bw: BufferWriter): BufferWriter;
      toRaw(): Buffer;
      toJSON(): string;
      static fromJSON(json: string): Script;
      getSubscript(index: number): Script;
      removeSeparators(): Script;

      /**
       * Throws `ScriptError` when it failed to excute
       * @param stack - Script execution stack
       * @param flags - defaults to `STANDARD_VERIFY_FLAGS`
       * @param tx - tx to verify
       * @param index - input index
       * @param value - Previous output value
       * @param version - Sighash Version (0=legacy, 1=segwit)
       */
      public execute(
        stack: Stack,
        flags?: common.flags,
        tx?: TX,
        index?: number,
        value?: Amount,
        version?: 0 | 1
      ): void;
      private findAndDelete(data: Buffer): number;
      private indexOf(data: Buffer): number;
      public isCode(): boolean;
      static fromPubKey(key: Buffer): Script;
      static fromPubkeyhash(hash: Buffer): Script;
      static fromMultisig(m: number, n: number, keys: Buffer[]): Script;
      static fromNulldata(flags: Buffer): Script;
      static fromProgram(version: number, data: Buffer): Script;
      static fromAddress(address: Address | string): Script;
      static fromCommitment(hash: Buffer, flags: string | Buffer): null;
      getRedeem(): Script | null;
      getType(): common.types;
      isUnknown(): boolean;
      isStandard(): boolean;
      getSize(): number;
      getInputAddress(): Address | null;
      getAddress(): Address | null;
      hash160(enc?: string): Buffer;
      sha256(enc?: string): Buffer;

      // ----- methods to test against output script (scriptPubKey)
      /**
       * Test whter the output script is pay-to-pubkey
       * @param minimal
       */
      isPubkey(minimal?: boolean): boolean;
      getPubkey(minimal?: boolean): Buffer | null;
      isPubkeyhash(minimal?: boolean): boolean;
      getPubkeyhash(minimal?: boolean): Buffer | null;
      isMultisig(minimal?: boolean): boolean;
      getMultisig(minimal?: boolean): [number, number];
      isScripthash(): boolean;
      getScripthash(): Buffer | null;
      isNulldata(): boolean;
      getNulldata(): Buffer | null;
      isCommitment(): boolean;
      getCommitment(): Buffer | null;
      isProgram(): boolean;
      getProgram(): Program | null;
      // -------------------------------------------------------

      public forWitness(): Script | null;
      public isWitnessPubkeyhash(): boolean;
      public isWitnessScripthash(): boolean;
      public getWitnessScripthash(): Buffer | null;
      public isUnspendable(): boolean;
      /**
       * guess the type of the input script
       */
      public getInputtype(): common.flags;
      /**
       * Guess whter the input script is an unknown type
       */
      public getInputtype(): boolean;
      public isPubkeyInput(): boolean;
      public getPubkeynput(): Buffer | null;
      public isPubkeyhashInput(): boolean;
      public getPubkeyhashInput(): [Buffer, Buffer] | [null, null];
      public isMultisigInput(): boolean;
      public getMultisigInput(): Buffer[] | null;
      public isScripthashInput(): boolean;
      getCoinbaseHeight(): number;
      static getCoinbaseHeight(raw: Buffer): number;
      test(filter: BloomFilter): boolean;
      public isPushOnly(): boolean;
      getSigops(accurate?: boolean): number;
      private getScripthashSigops(input?: Script): number;
      private getWitnessSigops(input?: Script): number;

      // ----- script mutation ------
      private get(index: number): Opcode | null;
      private pop(): Opcode | null;
      private shift(): Opcode | null;
      private remove(index: number): null;
      private set(index: number, op: Opcode): Script;
      private push(op: Opcode): Script;
      private unshift(op: Opcode): Script;
      private insert(index: number, op: Opcode): Script;

      // methods for mutating with Opcode
      getOp(index: number): Opcode | null;
      popOp(): Opcode | null;
      shiftOp(): Opcode | null;
      removeOp(index: number): null;
      setOp(index: number, op: Opcode): Script;
      pushOp(op: Opcode): Script;
      unshiftOp(op: Opcode): Script;
      insertOp(index: number, op: Opcode): Script;

      // methods for mutating with Buffer
      getData(index: number): Buffer | null;
      popData(): Buffer | null;
      shiftData(): Buffer | null;
      removeData(index: number): null;
      setData(index: number, op: Buffer): Script;
      pushData(op: Buffer): Script;
      unshiftData(op: Buffer): Script;
      insertData(index: number, op: Buffer): Script;
      getLength(index: number): number;

      // methods for mutating with Push data.
      // Pretty much similar to modifying with data.
      // But only works for pushdata opcode
      getPush(index: number): Buffer | null;
      popPush(): Buffer | null;
      shiftPush(): Buffer | null;
      removePush(index: number): null;
      setPush(index: number, op: Buffer): Script;
      pushPush(op: Buffer): Script;
      unshiftPush(op: Buffer): Script;
      insertPush(index: number, op: Buffer): Script;

      getString(index: number, enc?: string): string | null;
      popString(enc?: string): string | null;
      shiftString(enc?: string): string | null;
      removeString(enc?: string): string | null;
      setString(index: number, op: string): Script;
      pushString(op: string): Script;
      unshiftString(op: string): Script;
      insertString(index: number, op: string): Script;

      getSmall(index: number): script.common.SmallNumOp | -1;
      popSmall(): script.common.SmallNumOp | -1;
      shiftSmall(): script.common.SmallNumOp | -1;
      removeSmall(index: number): script.common.SmallNumOp | -1;
      setSmall(index: number, num?: number): Script;
      pushSmall(num: script.common.SmallNumOp): Script;
      unshiftSmall(num: script.common.SmallNumOp): Script;
      insertSmall(index: number, num: script.common.SmallNumOp): Script;

      getNum(index: number): ScriptNum | null;
      popNum(): ScriptNum | null;
      shiftNum(): ScriptNum | null;
      removeNum(index: number): null;
      setNum(index: number, op: ScriptNum): Script;
      pushNum(op: ScriptNum): Script;
      unshiftNum(op: ScriptNum): Script;
      insertNum(index: number, op: ScriptNum): Script;

      getInt(index: number): number | null;
      popInt(): number | null;
      shiftInt(): number | null;
      removeInt(index: number): null;
      setInt(index: number, op: number): Script;
      pushInt(op: number): Script;
      unshiftInt(op: number): Script;
      insertInt(index: number, op: number): Script;

      getBool(index: number): boolean;
      popBool(): boolean;
      shiftBool(): boolean;
      removeBool(index: number): boolean;
      setBool(index: number, op: boolean): Script;
      pushBool(op: boolean): Script;
      unshiftBool(op: boolean): Script;
      insertBool(index: number, op: boolean): Script;

      /**
       * returns string such as `0xff` or something like `OP_PUSH`
       * @param index
       */
      getSym(index: number): null | script.common.opcodesByVal | string;
      popSym(): null | script.common.opcodesByVal | string;
      shiftSym(): null | script.common.opcodesByVal | string;
      removeSym(index: number): null | script.common.opcodesByVal | string;
      setSym(
        index: number,
        symbol: script.common.opcodesByVal | script.common.opcodesByValShort
      ): Script;
      pushSym(
        symbol: script.common.opcodesByVal | script.common.opcodesByValShort
      ): Script;
      unshiftSym(
        symbol: script.common.opcodesByVal | script.common.opcodesByValShort
      ): Script;
      insertSym(
        symbol: script.common.opcodesByVal | script.common.opcodesByValShort
      ): Script;
      // ----------------------------

      private fromString(code: string): Script;
      static fromString(code: string): Script;
      /**
       * Used from TX.checkInput
       */
      static verify(
        input: Script,
        witness?: Witness,
        output?: Script,
        tx?: TX,
        index?: number,
        value?: Amount,
        flags?: common.flags
      ): void;
      private static verifyProgram(): void;
      static fromReader(br: BufferReader): Script;
      static fromRaw(data: Buffer | string, enc?: string): Script;
      static isScript(obj: object): boolean;
      encode(): Buffer;
      decode(data: Buffer, minimal?: boolean, limit?: number): ScriptNum;
      inspect(): string;
      static isMinimal(data: Buffer): boolean;
    }

    export class ScriptError extends Error {}

    export class ScriptNum extends I64 {
      constructor(
        num?: number | string | Buffer | object,
        base?: string | number
      );
      /**
       * Cast to int32
       */
      getInt(): number;
      toRaw(): Buffer;
      private fromRaw(data: Buffer): ScriptNum;
      static fromRaw(data: Buffer): ScriptNum;
      static decode(data: Buffer, minimal?: boolean, limit?: number): ScriptNum;
      static isScriptNum(obj: object): boolean;

      // ----- properties from I64 and BN -----
      // ----- re-diclaration was necessary to override function signature.
      hi: number;
      lo: number;
      sign: 0 | 1;
      static min(a: ScriptNum, b: ScriptNum): ScriptNum;
      static max(a: ScriptNum, b: ScriptNum): ScriptNum;
      static random(): I64;
      static pow(num: number, exp: number): ScriptNum;
      static shift(num: number, bits: number): ScriptNum;
      static readLE(data: number, offset: number): ScriptNum;
      static readBE(data: number, offset: number): ScriptNum;
      static readRaw(data: number, offset: number): ScriptNum;
      static readNumber(data: number): ScriptNum;
      static fromInt(lo: number): ScriptNum;
      static fromBits(hi: number, lo: number): ScriptNum;
      static fromObject(obj: { hi: number; lo: number }): ScriptNum;
      static fromString(str: string, base?: number): ScriptNum;
      static fromLE(data: Buffer): ScriptNum;
      static fromBE(data: Buffer): ScriptNum;
      static fromRaw(data: Buffer): ScriptNum;
      static isN64(obj: object): boolean;
      static isU64(obj: object): boolean;
      static isI64(obj: object): boolean;
      static fromString(str: string, base?: number): ScriptNum;
    }

    export class SigCache {}

    /**
     * Represents the stack of a Script during execution.
     */
    export class Stack implements Iterable<Buffer> {
      items: Buffer[];
      length: number;
      constructor(items?: Buffer[]);
      [Symbol.iterator]: () => Iterator<Buffer>;
      inspect(): string;
      toASM(decode?: boolean): string;
      clone(): Stack;
      clear(): Stack;
      get(index: number): Buffer | null;
      pop(): Buffer | null;
      shift(): Buffer | null;
      remove(index: number): Buffer | null;
      set(index: number, item: Buffer): Stack;
      /**
       * @param item
       * @returns number - stack size.
       */
      push(item: Buffer): number;
      unshift(item: Buffer): number;
      insert(index: number, item: Buffer): Stack;
      erase(start: number, end: number): Buffer[];
      swap(i1: number, i2: number): void;

      /*
       * Data
       */
      getData(index: number): Buffer | null;
      popData(index: number): Buffer | null;
      shiftData(): Buffer | null;
      removeData(index: number): Buffer | null;
      setData(index: number, data: Buffer): Stack;
      pushData(data: Buffer): number;
      unshiftData(data: Buffer): number;
      insertData(index: number, data: Buffer): Stack;

      /*
       * Length
       */
      getLength(index: number): number;

      /*
       * String
       */
      getString(index: number): string | null;
      popString(index: number): string | null;
      shiftString(): string | null;
      removeString(index: number): string | null;
      setString(index: number, data: string): Stack;
      pushString(data: string): number;
      unshiftString(data: string): number;
      insertString(index: number, data: string): Stack;

      /*
       * Num
       * TODO: complete typing
       */

      /*
       * Int
       */
      getInt(index: number, minimal?: boolean, limit?: number): number | null;
      popInt(minimal?: boolean, limit?: number): number;
      shiftInt(minimal?: boolean, limit?: number): string | null;
      removeInt(
        index: number,
        minimal?: boolean,
        limit?: number
      ): string | null;
      setInt(index: number, num: number): Stack;
      pushInt(num: number): number;
      unshiftInt(num: number): number;
      insertInt(index: number, num: number): Stack;
      /*
       * Bool
       * TODO: complete typing
       */

      static toString(item: Buffer, enc?: string): string;
      static fromString(str: string, enc?: string): string;
      /**
       *
       * @param item
       * @param minimal - if the number is `OP_0` ~ `OP_16`
       * @param limit - Size limit for ScriptNum
       */
      static toNum(item: Buffer, minimal?: boolean, limit?: number): ScriptNum;
      static fromNum(num: ScriptNum): Buffer;
      static fromInt(int: number): Stack;
      static toBool(item: Buffer): boolean;
      static fromBool(value: boolean): Stack;
    }

    export class Witness {
      items: Buffer[];
      constructor(options?: Buffer[] | { items: Buffer[] });
      static fromOptions(options: Buffer[] | { items: Buffer[] }): Witness;
      toArray(): Buffer[];
      fromArray(): Buffer[];
      static fromArray(): Buffer[];
      toItems(): Buffer[];
      fromItems(items: Buffer[]);
      static fromItems(items: Buffer[]): Witness;
      toStack(): Stack;
      fromStack(stack: Stack): Witness;
      static fromStack(stack: Stack): Witness;
      inspect(): string;
      clone(): Witness;
      getInputType(): common.types;
      getInputAddress(): Address | null;
      isPubkeyInput(): false;
      getPUbkeyInput(): null;
      test(filter: BloomFilter): boolean;
      getRedeem(): Script;
      indexOf(data: Buffer): number;
      getSize(): number;
      getVarSize(): number;
      private toWriter(bw: BufferWriter): number;
      toRaw(): Buffer | String;
      /**
       * returns hex string
       */
      toJSON(): string;
      /**
       *
       * @param json - hex string
       */
      static fromJSON(json: string): Witness;
      static fromRaw(data: Buffer | string, enc?: 'hex' | 'null'): Witness;
      /**
       * This method must contain only stack items.
       * use `fromJSON` if you want to instantiate from whole witness
       * including push opcodes
       * @param items
       */
      static fromString(items: string | string[]): Witness;
      static isWitness(): boolean;
    }
  }

  export class Opcode extends script.Opcode {}

  export class Program extends script.Program {}

  export class Script extends script.Script {}
  export class ScriptNum extends script.ScriptNum {}

  export class sigcache extends script.SigCache {}
  export class Stack extends script.Stack {}
  export class Witness extends script.Witness {}
}
