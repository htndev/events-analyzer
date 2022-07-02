import { EXPORT_FILE_NAME, FORMAT_EXTENSION, ExportFormat } from './../constants/export.constant';
import { endQuote, startQuote } from '../constants/regex.constant';
import { isNumber } from '../validators/type.validator';

export const doesWrappedIntoQuotes = (str: string) =>
  startQuote().test(str) && endQuote().test(str);

export const removeQuotes = (str: string) => str.replace(startQuote(), '').replace(endQuote(), '');

export const parseValue = (str: string) => {
  const value = doesWrappedIntoQuotes(str) ? removeQuotes(str) : str;

  return isNumber(value) ? +value : value;
};

export const generateExportFilename = (extension: string) =>
  `${EXPORT_FILE_NAME}-${new Date()
    .toUTCString()
    .replace(/\s+/g, '-')
    .replace(/,/g, '')}.${extension}`;

export const generateCsvFilename = () => generateExportFilename(FORMAT_EXTENSION[ExportFormat.CSV]);

export const generateExcelFilename = () =>
  generateExportFilename(FORMAT_EXTENSION[ExportFormat.Excel]);
