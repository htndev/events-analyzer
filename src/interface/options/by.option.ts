import { IEvent } from './../../common/types';
import { getObjectValue } from './../../common/utils/object.util';
import { BaseOption } from './base.option';

export class ByOption extends BaseOption {
  constructor() {
    super('--by <predicate>', 'by', 'Options used to filter data', '');
  }

  perform(events: IEvent[]): Record<string, number> {
    const groupedEvents = events.reduce((total, event) => {
      const eventComparingValue = getObjectValue(event, this.value as string);

      if (Array.isArray(eventComparingValue)) {
        return total;
      }

      return {
        ...total,
        [eventComparingValue.toString()]: ((total as any)['' + eventComparingValue] || 0) + 1
      };
    }, {});

    return groupedEvents;
  }
}
