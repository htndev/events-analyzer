export enum EventField {
  Id = 'id',
  Timestamp = 'timestamp',
  Category = 'category',
  Action = 'action',
  Value = 'value',
  Tags = 'tags',
  Uid = 'meta.uid',
  Device = 'meta.device',
  OS = 'meta.os',
  Browser = 'meta.browser',
  FirstName = 'meta.user.firstName',
  LastName = 'meta.user.lastName',
  Email = 'meta.user.email'
}

export const EVENT_FIELDS = Object.values(EventField);

export const EventFieldTitle: Record<EventField, string> = {
  [EventField.Id]: "Event's id",
  [EventField.Action]: "Event's action",
  [EventField.Category]: "Event's category",
  [EventField.Value]: "Event's value",
  [EventField.Device]: 'User\'s device',
  [EventField.Uid]: 'User\'s id',
  [EventField.Timestamp]: 'Date of event',
  [EventField.Tags]: "Event's tags",
  [EventField.Email]: 'User\'s email',
  [EventField.FirstName]: 'User\'s first name',
  [EventField.LastName]: 'User\'s last name',
  [EventField.Browser]: 'User\'s browser',
  [EventField.OS]: "User's operating system"
};
