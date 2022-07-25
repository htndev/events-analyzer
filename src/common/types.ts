import { GraphType } from './constants/options.constant';
import { EventField } from './constants/event-field.constant';
import { Style } from './utils/console.util';

export type Nullable<T> = T | null;

export type PossiblePromise<T> = T | Promise<T>;

export type ValueType = string | number | boolean;

export type _OptionsType<T extends string> = {
  [K in T]: ValueType;
};

export type OptionType = { option: string; description: string; default?: ValueType };

export type ClassType<T> = { new (...args: any[]): T };

export type Optional<T> = T | null | undefined;

export type KeyValueType = Record<string, ValueType>;

export type ConfigType = Record<string, ValueType | KeyValueType>;

export type StyleFunction = (str: string) => Style | string;

export interface IEvent {
  id: string;
  meta: {
    uid: string;
    user: {
      firstName: string;
      lastName: string;
      email: string;
    };
    device: string;
    os: string;
    browser: string;
  };
  timestamp: string;
  category: string;
  action: string;
  value: string;
  tags: string[];
}

export enum WizardQuestionType {
  Input = 'input',
  MultipleCheck = 'checkbox',
  List = 'list',
  Confirmation = 'confirm'
}

export interface IParsedFilter {
  field: string;
  action: string;
  value: string;
}

export type PrintEventType = Record<EventField, ValueType | string[]>;

export type PieGraphEvent = { criteria: string; amount: number };

export type GraphStructure = { type: GraphType; events: PieGraphEvent[] };
