import { ExportFormat } from '../../common/constants/export.constant';
import { BaseOption } from './base.option';

export class ExportOption extends BaseOption {
  constructor() {
    super(
      '-E, --export-to <format>',
      'exportTo',
      'Export option used for exporting your output into csv or excel file',
      ''
    );
  }
}
