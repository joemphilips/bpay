declare module 'bevent' {
  import { EventEmitter } from 'events';
  export default class AsyncEmitter extends EventEmitter {}
}
