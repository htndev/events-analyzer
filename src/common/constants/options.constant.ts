import { EventField } from './event-field.constant';

export enum DisplayView {
  Basic = 'basic',
  Main = 'main',
  Detailed = 'detailed',
  Custom = 'custom'
}

export type PredefinedDisplayFields = Exclude<DisplayView, DisplayView.Custom>;

export const DISPLAY_FIELDS: { [k in PredefinedDisplayFields]: EventField[] } = {
  [DisplayView.Basic]: [EventField.Id, EventField.Action, EventField.Timestamp],
  [DisplayView.Main]: [
    EventField.Id,
    EventField.Action,
    EventField.Category,
    EventField.Value,
    EventField.Timestamp,
    EventField.Tags
  ],
  [DisplayView.Detailed]: [
    EventField.Id,
    EventField.Action,
    EventField.Category,
    EventField.Value,
    EventField.Timestamp,
    EventField.Tags,
    EventField.Device,
    EventField.OS,
    EventField.Email
  ]
};

export const DISPLAY_FIELDS_SEPARATOR = ',';

export const DEFAULT_DISPLAY_VIEW = DisplayView.Basic;

export enum AnalyzeCriteria {
  Rare = 'rare',
  Frequent = 'frequent',
  All = 'all'
}

export const SYSTEM_ANALYZE_CRITERIA = Object.values(AnalyzeCriteria);

export enum GraphType {
  Pie = 'pie',
  Bar = 'bar',
  Line = 'line'
}
