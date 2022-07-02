import { EventField } from './../common/constants/event-field.constant';
import { IEvent, PrintEventType } from './../common/types';
import { BaseSerializer } from './base.serializer';

const ObjectsToCsv = require('objects-to-csv');

export class CSVSerializer extends BaseSerializer {
  async stringify(input: PrintEventType[]): Promise<string> {
    const csv = new ObjectsToCsv(input);

    return await csv.toString();
  }

  parse(input: any) {}
}

export const csvSerializer = new CSVSerializer();
