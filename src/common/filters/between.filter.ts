import { EventField } from './../constants/event-field.constant';
import { IEvent } from '../types';
import { BaseFilter } from './base.filter';
import { isAfter, isBefore } from 'date-fns';

export class BetweenFilter extends BaseFilter {
  dateSplitSign = '-';
  rangeSeparator = ';';

  filter(events: IEvent[]): IEvent[] {
    const rawRanges = this.input.split(this.rangeSeparator);
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
