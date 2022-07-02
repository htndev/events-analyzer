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
import {
  DISPLAY_FIELDS,
  DISPLAY_FIELDS_SEPARATOR
} from './../../common/constants/options.constant';
import { prepareForPrint } from './../../common/utils/object.util';
import { generateCsvFilename } from './../../common/utils/string.util';
import { resolve, writeFile } from './../../common/utils/system.util';
import { csvSerializer } from './../../serializer/csv.serializer';
import { excelSerializer } from './../../serializer/excel.serializer';
import { ExportOption } from './../options/export.option';
import { BaseCommand } from './base.command';

const filterForbiddenFields = <T>(
  filters: T[],
  allowed: string[],
  field: keyof IParsedFilter
): T[] => filters.filter((f) => !allowed.includes((f as any)[field]));

export class RetrieveCommand extends BaseCommand {
  constructor() {
    super(`${Command.Retrieve} [filters...]`, 'Retrieve events based on your criteria', [
      LimitOption,
      OffsetOption,
      DisplayFieldsOption,
      DisplayViewOption,
      ExportOption
    ]);
  }

  async action(
    {
      limit,
      offset,
      displayFields,
      displayView,
      exportTo
    }: {
      limit: LimitOption;
      offset: OffsetOption;
      displayView: DisplayViewOption;
      displayFields: DisplayFieldsOption;
      exportTo: ExportOption;
    },
    args: string[]
  ): Promise<void> {
    const events = await this.readEvents();
    if (!events) {
      return;
    }
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
    const fields = displayFields.value
      ? (displayFields.value.split(DISPLAY_FIELDS_SEPARATOR) as EventField[])
      : DISPLAY_FIELDS[displayView.value];

    const printEvents = prepareForPrint(filteredEvents, fields);

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
