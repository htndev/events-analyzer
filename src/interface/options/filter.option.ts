import { BaseOption } from './base.option';

export class FilterOption extends BaseOption {
  constructor() {
    super(
      '-F, --filter <filter>',
      'filter',
      'Filter used to show certain items which is following specific criteria',
      ''
    );
  }
}
