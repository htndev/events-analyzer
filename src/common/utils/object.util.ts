import { KEY_SEPARATOR } from '../constants/config.constant';
import { ValueType } from '../types';
import { EventField, EVENT_FIELDS } from './../constants/event-field.constant';
import { IEvent, PrintEventType } from './../types';

export const getObjectValue = (object: Record<string, any>, key: string): ValueType | string[] => {
  const [initialKey, ...restKeys] = key.split(KEY_SEPARATOR);

  return restKeys.reduce(
    (result: any, k: string) =>
      typeof result === 'object' && !Array.isArray(result[k]) ? result[k] : result,
    object[initialKey]
  );
};

export const prepareForPrint = (events: IEvent[], fields: EventField[]): PrintEventType[] =>
  events.map((e) =>
    fields.reduce(
      (total, field) => ({ ...total, [field]: getObjectValue(e, field) }),
      {} as PrintEventType
    )
  );
