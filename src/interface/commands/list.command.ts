import { EventField } from './../../common/constants/event-field.constant';
import { prepareForPrint } from './../../common/utils/object.util';
import {
  DISPLAY_FIELDS,
  DISPLAY_FIELDS_SEPARATOR
} from './../../common/constants/options.constant';
import { ValueType } from '../../common/types';
import { BaseOption } from '../options/base.option';
import { Command } from '../../common/constants/command.constant';
import { DisplayView } from '../../common/constants/options.constant';
import { DisplayFieldsOption } from '../options/display-fields.option';
import { DisplayViewOption } from '../options/display-view.option';
import { LimitOption } from '../options/limit.option';
import { OffsetOption } from '../options/offset.option';
import { BaseCommand } from './base.command';

export class ListCommand extends BaseCommand {
  constructor() {
    super(`${Command.List} [args...]`, 'List all events', [
      LimitOption,
      OffsetOption,
      DisplayViewOption,
      DisplayFieldsOption
    ]);
  }

  async action({
    offset,
    limit,
    displayView,
    displayFields
  }: {
    offset: LimitOption;
    limit: OffsetOption;
    displayView: DisplayViewOption;
    displayFields: DisplayFieldsOption;
  }): Promise<void> {
    const events = await this.readEvents();

    if (!events) {
      return;
    }

    const filteredEvents = this.filterEvents(events, [offset, limit]);

    const fields = displayFields.value
      ? (displayFields.value.split(DISPLAY_FIELDS_SEPARATOR) as EventField[])
      : DISPLAY_FIELDS[displayView.value];

    this.printer.print(prepareForPrint(filteredEvents, fields));
  }
}
