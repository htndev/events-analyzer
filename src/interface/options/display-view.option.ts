import { PredefinedDisplayFields } from './../../common/constants/options.constant';
import { DisplayView } from '../../common/constants/options.constant';
import { BaseOption } from './base.option';

export class DisplayViewOption extends BaseOption<PredefinedDisplayFields | ''> {
  constructor() {
    super(
      '-DV, --display-view <displayView>',
      'displayView',
      'Display view used to show different amount information',
      ''
    );
  }
}
