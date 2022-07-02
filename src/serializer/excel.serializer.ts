import { resolve } from './../common/utils/system.util';
import { bold, italic } from 'chalk';
import { Logger } from './../common/utils/logger.util';
import { Workbook } from 'exceljs';
import { PrintEventType } from './../common/types';
import { generateExcelFilename } from './../common/utils/string.util';
import { BaseSerializer } from './base.serializer';

export class ExcelSerializer extends BaseSerializer {
  parse(input: any) {}

  async stringify(input: PrintEventType[]): Promise<void> {
    const book = new Workbook();
    const sheet = book.addWorksheet('Analytics');
    sheet.addRow(Object.keys(input[0]));
    sheet.addRows(input.map(Object.values));
    const path = resolve(generateExcelFilename());
    await book.xlsx.writeFile(path);
    Logger.info('Your events have been generated and written in file', italic(bold(path)));
  }
}

export const excelSerializer = new ExcelSerializer();
