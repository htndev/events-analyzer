import { BaseOption } from './base.option';

export class DisplayFieldsOption extends BaseOption<string> {
  constructor() {
    super(
      '-DF, --display-fields <displayFields>',
      'displayFields',
      'Display fields used to display specified by user fields',
      ''
    );
  }
}
