import { ValueType } from '../types';

export const isBoolean = (v: ValueType): v is boolean => v === 'true' || v === 'false';

export const isNumber = (v: ValueType): v is number => !Number.isNaN(+v);
