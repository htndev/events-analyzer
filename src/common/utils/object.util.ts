import { KEY_SEPARATOR } from '../constants/config.constant';
import { ValueType } from '../types';
import { EventField } from './../constants/event-field.constant';
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

export const mapObject = <T = Record<string, any>>(obj: Record<string, any>): T => {
  const flatObject: Record<string, any> = {};
  const path: string[] = [];

  const dig = (obj: Record<string, any>) => {
    if (obj !== Object(obj)) return (flatObject[path.join('.')] = obj);

    for (let key in obj) {
      path.push(key);
      dig(obj[key]);
      path.pop();
    }
  };

  dig(obj);

  return flatObject as T;
};
