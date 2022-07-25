import { EqualsFilter } from '../filters/equals.filter';
import { IncludesFilter } from '../filters/includes.filter';
import { MatchFilter } from '../filters/match.filter';

export enum FilterAction {
  Equals = 'equals',
  Includes = 'includes',
  Match = 'match'
}

export const FILTER_MAP = {
  [FilterAction.Equals]: EqualsFilter,
  [FilterAction.Includes]: IncludesFilter,
  [FilterAction.Match]: MatchFilter
};
