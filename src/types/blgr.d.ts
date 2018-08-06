declare module 'blgr' {
  export class Logger {
    levels: {
      NONE: 0;
      ERROR: 1;
      WARNING: 2;
      INFO: 3;
      DEBUG: 4;
      SPAM: 5;
    };
    constructor(options?: { level?: string | number; colors?: boolean });
    private set(options: any): void;
    public open(): Promise<void>;
    public close(): Promise<void>;
    private truncate(): Promise<void>;
    public error(...args: any[]): void;
    public warning(...args: any[]): void;
    public info(...args: any[]): void;
    public debug(...args: any[]): void;
    public spam(...args: any[]): void;
    public log(level: string, module?: string, args?: Array<object>);
  }
}
