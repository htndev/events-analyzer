import { PossiblePromise } from './../common/types';

export abstract class BaseSerializer {
  abstract parse(input: any): PossiblePromise<any>;

  abstract stringify(input: any): PossiblePromise<string | void>;
}
