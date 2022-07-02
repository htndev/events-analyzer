import { getObjectValue } from '../utils/object.util';
import { IEvent } from '../types';
import { BaseFilter } from './base.filter';

export class EqualsFilter extends BaseFilter {
  filter(events: IEvent[]): IEvent[] {
    return events.filter((event) => {
      const value = getObjectValue(event, this.field);

      return value === this.input;
    });
  }
}
