import { EqualsFilter } from '../filters/equals.filter';
import { IncludesFilter } from '../filters/includes.filter';
import { MatchFilter } from '../filters/match.filter';
import { BetweenFilter } from './../filters/between.filter';

export enum FilterAction {
  Equals = 'equals',
  Includes = 'includes',
  Match = 'match',
  Between = 'between'
}

export const FILTER_MAP = {
  [FilterAction.Equals]: EqualsFilter,
  [FilterAction.Includes]: IncludesFilter,
  [FilterAction.Match]: MatchFilter,
  [FilterAction.Between]: BetweenFilter
};
