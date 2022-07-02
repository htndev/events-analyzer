export enum ExportFormat {
  CSV = 'csv',
  Excel = 'excel'
}

export const EXPORT_FILE_NAME = 'analytics';

export const FORMAT_EXTENSION = {
  [ExportFormat.CSV]: 'csv',
  [ExportFormat.Excel]: 'xlsx'
};
