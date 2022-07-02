import { IEvent } from '../../common/types';
import { BaseOption } from './base.option';

export class OffsetOption extends BaseOption {
  constructor() {
    super(
      '-O, --offset <offset>',
      'offset',
      'Offset is used to identify the starting point to return rows from a result set',
      0
    );
  }

  perform(events: IEvent[]): IEvent[] {
    return events.slice(this.value as number);
  }
}
