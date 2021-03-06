import { bold, italic } from 'chalk';
import { Command } from '../../common/constants/command.constant';
import { ClassType, IEvent, PossiblePromise, ValueType } from '../../common/types';
import { Logger } from '../../common/utils/logger.util';
import { Printer } from '../../common/utils/printer.util';
import { doesFileExist, readJSON } from '../../common/utils/system.util';
import { isBoolean, isNumber } from '../../common/validators/type.validator';
import { config } from '../../config/config';
import { BaseOption } from '../options/base.option';
import { EventField } from './../../common/constants/event-field.constant';
import {
  DEFAULT_DISPLAY_VIEW,
  DISPLAY_FIELDS,
  DISPLAY_FIELDS_SEPARATOR
} from './../../common/constants/options.constant';
import { DisplayFieldsOption } from './../options/display-fields.option';
import { DisplayViewOption } from './../options/display-view.option';

export abstract class BaseCommand {
  protected logger: Logger;
  protected printer = new Printer();

  constructor(
    public name: string,
    public description: string,
    public options: ClassType<BaseOption>[] = []
  ) {
    this.logger = new Logger(this.label);
  }

  get label(): string {
    return this.name.split(' ')[0];
  }

  abstract action(options: Record<string, BaseOption>, args: string[]): PossiblePromise<void>;

  callAction(options: Record<string, any>, environment: Record<string, any>) {
    const args = environment.args;

    try {
      const opts = this.options.reduce((total: any, option: ClassType<BaseOption>) => {
        const opt = new option();

        return {
          ...total,
          [opt.key]: options[opt.key]
            ? opt.setValue(this.getSafeArgumentValue(options[opt.key]))
            : opt
        };
      }, {});

      return this.action(opts, args);
    } catch (e) {}
  }

  private getSafeArgumentValue(value: ValueType): ValueType {
    if (isBoolean(value)) {
      return value;
    }

    if (isNumber(value)) {
      return +value;
    }

    return value;
  }

  protected filterEvents(events: IEvent[], filters: BaseOption[]): IEvent[] {
    const _events = [...events];
    const result = filters.reduce((total, filter) => filter.perform?.(total) as IEvent[], _events);

    return result;
  }

  protected async readEvents(): Promise<IEvent[] | void> {
    if (!config.events) {
      this.logger.error('Unfortunately, I cannot list events, because events is not set up.');
      this.logger.info('Run', bold(`${config.name} ${Command.Init}`), 'to configure events.');
      return;
    }

    const eventsPath = config.events as string;

    if (!(await doesFileExist(eventsPath))) {
      this.logger.error('Cannot find events in', `'${italic(eventsPath)}'`);
      this.logger.info('Ensure that file is presented in this path.');
      return;
    }

    this.logger.info('Reading your events...');
    return readJSON(eventsPath);
  }

  protected getDisplayFields(
    displayFields: DisplayFieldsOption,
    displayView: DisplayViewOption
  ): EventField[] {
    switch (true) {
      case !!displayFields.value:
        return displayFields.value.split(DISPLAY_FIELDS_SEPARATOR) as EventField[];
      case !!displayView.value:
        return (DISPLAY_FIELDS as any)[displayView.value];
      case !!config.defaultDisplayFields?.length:
        return config.defaultDisplayFields as EventField[];
      default:
        return DISPLAY_FIELDS[DEFAULT_DISPLAY_VIEW];
    }
  }
}
