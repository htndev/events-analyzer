import { IEvent, ValueType } from '../../common/types';

export interface BaseOption {
  perform?(events: IEvent[]): any;
}

export abstract class BaseOption<T = ValueType> {
  private intervalValue?: T;

  constructor(
    public name: string,
    public key: string,
    public description: string,
    public defaultValue: T
  ) {}

  get value(): T {
    return this.intervalValue || this.defaultValue;
  }

  setValue(v: T): this {
    this.intervalValue = v;

    return this;
  }
}
