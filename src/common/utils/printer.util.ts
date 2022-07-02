import { PrintEventType } from './../types';
import { Logger } from './logger.util';

export class Printer {
  print(events: PrintEventType[]): void {
    Logger.table(events);
  }
}
