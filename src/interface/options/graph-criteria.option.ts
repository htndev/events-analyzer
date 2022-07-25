import { EventField } from './../../common/constants/event-field.constant';
import { BaseOption } from './base.option';

export class GraphCriteria extends BaseOption {
  constructor() {
    super(
      '--graph-criteria <graphCriteria>',
      'graphCriteria',
      'Used for determining graphic key metric data',
      EventField.Action
    );
  }
}
