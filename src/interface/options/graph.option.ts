import { BaseOption } from './base.option';

export class GraphOption extends BaseOption {
  constructor() {
    super('-G, --graph', 'graph', 'Used to display output in a graph view', false);
  }
}
