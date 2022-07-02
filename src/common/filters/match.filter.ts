import { IEvent } from '../types';
import { getObjectValue } from '../utils/object.util';
import { BaseFilter } from './base.filter';

export class MatchFilter extends BaseFilter {
  filter(events: IEvent[]): IEvent[] {
    const regex = this.isRegExp() ? this.prepareRegExpInput() : this.prepareStringInput();

    return events.filter((event) => {
      const value = getObjectValue(event, this.field);

      return Array.isArray(value)
        ? value.every((v) => regex.test(v))
        : regex.test(value.toString());
    });
  }

  private isRegExp(): boolean {
    const endOfRegexp = /\/g?i?$/;
    return this.input.startsWith('/') && endOfRegexp.test(this.input);
  }

  private prepareStringInput() {
    let internalInput = this.input;

    if (internalInput.startsWith('*')) {
      internalInput = internalInput.replace(/^\*/, '.*');
    }

    if (internalInput.endsWith('*')) {
      internalInput = internalInput.replace(/\*$/, '.*');
    }

    return new RegExp(`^${internalInput}$`);
  }

  private prepareRegExpInput() {
    const [allInput, body = '', flags = ''] = this.input.match(/\/(.*)\/(g?i?)/) || [];

    return new RegExp(`${body}`, flags);
  }
}
