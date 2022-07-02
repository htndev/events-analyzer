import { IEvent } from '../../common/types';
import { BaseOption } from './base.option';

export class LimitOption extends BaseOption<number> {
  constructor() {
    super(
      '-L, --limit <limit>',
      'limit',
      'Limit used to set an upper limit on the number of returning values',
      Infinity
    );
  }

  perform(events: IEvent[]): IEvent[] {
    return events.slice(0, this.value);
  }
}
