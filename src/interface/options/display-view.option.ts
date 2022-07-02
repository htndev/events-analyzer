import { DisplayView } from '../../common/constants/options.constant';
import { BaseOption } from './base.option';

export class DisplayViewOption extends BaseOption<Exclude<DisplayView, DisplayView.Custom>> {
  constructor() {
    super(
      '-DV, --display-view <displayView>',
      'displayView',
      'Display view used to show different amount information',
      DisplayView.Basic
    );
  }
}
