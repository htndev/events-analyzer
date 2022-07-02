import { EventField } from './event-field.constant';

export enum DisplayView {
  Basic = 'basic',
  Main = 'main',
  Detailed = 'detailed',
  Custom = 'custom'
}

export const DISPLAY_FIELDS: { [k in Exclude<DisplayView, DisplayView.Custom>]: EventField[] } = {
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
