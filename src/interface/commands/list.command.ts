import { ValueType } from './../../common/types';
import { GraphCriteria } from './../options/graph-criteria.option';
import { graphSerializer } from './../../serializer/graph.serializer';
import { GraphOption } from './../options/graph.option';
import { Command } from '../../common/constants/command.constant';
import { DisplayFieldsOption } from '../options/display-fields.option';
import { DisplayViewOption } from '../options/display-view.option';
import { LimitOption } from '../options/limit.option';
import { OffsetOption } from '../options/offset.option';
import { prepareForPrint, getObjectValue } from './../../common/utils/object.util';
import { DateRangeOption } from './../options/date-range.option';
import { BaseCommand } from './base.command';
import { GraphType } from '../../common/constants/options.constant';

export class ListCommand extends BaseCommand {
  constructor() {
    super(`${Command.List}`, 'List all events', [
      LimitOption,
      OffsetOption,
      DisplayViewOption,
      DisplayFieldsOption,
      DateRangeOption,
      GraphOption,
      GraphCriteria
    ]);
  }

  async action({
    offset,
    limit,
    displayView,
    displayFields,
    dateRange,
    graph,
    graphCriteria
  }: {
    offset: LimitOption;
    limit: OffsetOption;
    displayView: DisplayViewOption;
    displayFields: DisplayFieldsOption;
    dateRange: DateRangeOption;
    graph: GraphOption;
    graphCriteria: GraphCriteria;
  }): Promise<void> {
    let events = await this.readEvents();

    if (!events) {
      return;
    }

    events = dateRange.perform(events);

    const filteredEvents = this.filterEvents(events, [offset, limit]);

    if (graph.value) {
      const eventOccupance = filteredEvents.reduce((total, event) => {
        const key = getObjectValue(event, graphCriteria.value as string) as string;
        return {
          ...total,
          [key]: ((total as any)[key] || 0) + 1
        };
      }, {});

      await graphSerializer.stringify({
        type: GraphType.Pie,
        events: Object.entries(eventOccupance).map(([criteria, amount]: [string, any]) => ({
          criteria,
          amount
        }))
      });
      return;
    }

    this.printer.print(
      prepareForPrint(filteredEvents, this.getDisplayFields(displayFields, displayView))
    );
  }
}
