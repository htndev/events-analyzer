import { IEvent } from '../types';
import { getObjectValue } from '../utils/object.util';
import { BaseFilter } from './base.filter';

export class IncludesFilter extends BaseFilter {
  filter(events: IEvent[]): IEvent[] {
    return events.filter((event) => {
      const value = getObjectValue(event, this.field);

      return Array.isArray(value)
        ? value.includes(this.input)
        : value.toString().includes(this.input);
    });
  }
}
