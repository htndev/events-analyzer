import { IParsedFilter } from '../common/types';
import { BaseSerializer } from './base.serializer';

const filterRegex = () => /([a-zA-Z0-9_\-\.=-]+)(?!\\:):([a-zA-Z]+)(?!\\:):(.+)/;

export class FilterSerializer extends BaseSerializer {
  stringify(input: any): string {
    return '';
  }

  parse(input: string): IParsedFilter {
    const [allString = '', field = '', action = '', value = ''] = input.match(filterRegex()) || [];

    return {
      field,
      action,
      value
    };
  }
}

export const filterSerializer = new FilterSerializer();
