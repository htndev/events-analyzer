import isAfter from 'date-fns/isAfter';
import isBefore from 'date-fns/isBefore';
import { IEvent } from './../../common/types';
import { BaseOption } from './base.option';

export class DateRangeOption extends BaseOption<string> {
  private dateSplitSign = '-';
  private rangeSeparator = ';';

  constructor() {
    super(
      '-DR, --date-range <range>',
      'dateRange',
      'Used to retrieve events only in a date range',
      ''
    );
  }

  perform(events: IEvent[]): IEvent[] {
    return this.value ? this.filterEventsByDate(events) : events;
  }

  private filterEventsByDate(events: IEvent[]): IEvent[] {
    const rawRanges = this.value.split(this.rangeSeparator);

    const ranges = rawRanges.map((range) => {
      const [from = '', to = ''] = range.split(this.dateSplitSign);

      return {
        ...(from && { from: new Date(from) }),
        ...(to && { to: new Date(to) })
      };
    });

    const isBetween = (date: Date) =>
      ranges.some((range) => {
        const validationPassed = [];

        if (range.from) {
          validationPassed.push(isAfter(date, range.from));
        }

        if (range.to) {
          validationPassed.push(isBefore(date, range.to));
        }

        return validationPassed.every((vp) => vp === true);
      });

    return events.filter((event) => isBetween(new Date(event.timestamp)));
  }
}
