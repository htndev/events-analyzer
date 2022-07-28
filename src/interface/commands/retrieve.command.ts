import { graphSerializer } from './../../serializer/graph.serializer';
import { GraphCriteria } from './../options/graph-criteria.option';
import { GraphOption } from './../options/graph.option';
import { DateRangeOption } from './../options/date-range.option';
import { Command } from '../../common/constants/command.constant';
import { EventField } from '../../common/constants/event-field.constant';
import { FILTER_MAP } from '../../common/constants/filter.constant';
import { BaseFilter } from '../../common/filters/base.filter';
import { IParsedFilter } from '../../common/types';
import { bold, italic } from '../../common/utils/console.util';
import { filterSerializer } from '../../serializer/filter.serializer';
import { DisplayFieldsOption } from '../options/display-fields.option';
import { DisplayViewOption } from '../options/display-view.option';
import { LimitOption } from '../options/limit.option';
import { OffsetOption } from '../options/offset.option';
import { ExportFormat } from './../../common/constants/export.constant';
import { getObjectValue, prepareForPrint } from './../../common/utils/object.util';
import { generateCsvFilename } from './../../common/utils/string.util';
import { resolve, writeFile } from './../../common/utils/system.util';
import { csvSerializer } from './../../serializer/csv.serializer';
import { excelSerializer } from './../../serializer/excel.serializer';
import { ExportOption } from './../options/export.option';
import { BaseCommand } from './base.command';
import { GraphType } from '../../common/constants/options.constant';

const filterForbiddenFields = <T>(
  filters: T[],
  allowed: string[],
  field: keyof IParsedFilter
): T[] => filters.filter((f) => !allowed.includes((f as any)[field]));

export class RetrieveCommand extends BaseCommand {
  constructor() {
    super(`${Command.Retrieve}`, 'Retrieve events based on your criteria', [
      LimitOption,
      OffsetOption,
      DisplayFieldsOption,
      DisplayViewOption,
      ExportOption,
      DateRangeOption,
      GraphOption,
      GraphCriteria
    ]);
  }

  async action(
    {
      limit,
      offset,
      displayFields,
      displayView,
      exportTo,
      dateRange,
      graph,
      graphCriteria
    }: {
      limit: LimitOption;
      offset: OffsetOption;
      displayView: DisplayViewOption;
      displayFields: DisplayFieldsOption;
      exportTo: ExportOption;
      dateRange: DateRangeOption;
      graph: GraphOption;
      graphCriteria: GraphCriteria;
    },
    args: string[]
  ): Promise<void> {
    let events = await this.readEvents();
    if (!events) {
      return;
    }

    events = dateRange.perform(events);
    const parsedFilters = args.map(filterSerializer.parse);
    const allowedFields = Object.values(EventField);
    const notExistingFields = filterForbiddenFields(parsedFilters, allowedFields, 'field');

    if (notExistingFields.length) {
      if (notExistingFields.length) {
        this.logger.error(
          'Fields',
          italic(notExistingFields.map((e) => `'${e.field}'`).join(', ')),
          'do not exists in system'
        );
        this.logger.info(
          'You are allowed to use next fields:',
          bold(allowedFields.join(', ')),
          '.'
        );
        return;
      }
    }

    const systemFilters = Object.keys(FILTER_MAP);
    const notExistingActions = filterForbiddenFields(parsedFilters, systemFilters, 'action');

    if (notExistingActions.length) {
      this.logger.error(
        'Filters',
        italic(notExistingActions.map((e) => `'${e.action}'`).join(', ')),
        'do not exists in system'
      );
      return;
    }

    const filters: BaseFilter[] = parsedFilters.map(
      (pf) => new (FILTER_MAP as any)[pf.action](pf.field, pf.value)
    );
    const rawFilteredEvents = filters.reduce((result, filter) => filter.filter(result), events);
    const filteredEvents = this.filterEvents(rawFilteredEvents, [offset, limit]);

    if (graph.value) {
      const GRAPH_BASE = [
        ...new Set(
          filteredEvents.map((e) => getObjectValue(e, graphCriteria.value as string) as string)
        )
      ].reduce((keys, key) => ({ ...keys, [key]: 0 }), {});
      const graphData = filteredEvents.reduce((total: any, event) => {
        const time = event.timestamp.slice(0, 10);
        const value = total[time] || { ...GRAPH_BASE };
        value[getObjectValue(event, graphCriteria.value as string) as string]++;

        return {
          ...total,
          [time]: value
        };
      }, {});
      await graphSerializer.stringify({ type: GraphType.Line, events: graphData });
      return;
    }

    const printEvents = prepareForPrint(
      filteredEvents,
      this.getDisplayFields(displayFields, displayView)
    );

    if (exportTo.value) {
      switch (exportTo.value) {
        case ExportFormat.CSV: {
          const [path, content] = [
            resolve(`./${generateCsvFilename()}`),
            await csvSerializer.stringify(printEvents)
          ];
          await writeFile(path, content);
          this.logger.info(
            'Your events have been generated and written in file',
            bold(italic(path))
          );
          break;
        }
        case ExportFormat.Excel: {
          await excelSerializer.stringify(printEvents);
          break;
        }
        default:
          break;
      }
      return;
    }

    this.printer.print(printEvents);
  }
}
