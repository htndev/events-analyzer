import { IEvent } from '../types';

export abstract class BaseFilter {
  constructor(public field: string, public input: string) {}

  abstract filter(events: IEvent[]): IEvent[];
}
