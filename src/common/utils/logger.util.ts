import { bold, cyan, italic, red, yellow } from './console.util';

export class Logger {
  private static logFn = console.log;
  private static tableFn = console.table;

  constructor(private readonly label: string) {}

  get prefix(): string {
    return `[${italic(this.label)}]`;
  }

  static log(...args: any[]): void {
    Logger.logFn(...args);
  }

  log(...args: any[]) {
    Logger.log(this.prefix, ...args);
  }

  static error(...args: any[]): void {
    Logger.logFn('❕', bold(red(...args)));
  }

  error(...args: any[]) {
    Logger.error(this.prefix, ...args);
  }

  static warn(...args: any[]): void {
    Logger.logFn(`⚠️`, bold(yellow(...args)));
  }

  warn(...args: any[]) {
    Logger.warn(this.prefix, ...args);
  }

  static info(...args: any[]): void {
    Logger.logFn('ℹ️ ', cyan(...args));
  }

  info(...args: any[]) {
    Logger.info(this.prefix, ...args);
  }

  static table(data: any[]): void {
    this.tableFn(data);
  }
}
