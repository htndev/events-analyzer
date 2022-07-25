import { DefaultDisplayFieldsQuestion } from './../wizards/questions/default-display-fields.question';
import { EventsPathQuestion } from './../wizards/questions/events-path.question';
import { eventsPathValidator } from './../../common/validators/events-path.validator';
import { Choice } from '../wizards/choices/choice';
import { Question } from '../wizards/questions/base.question';
import { Command } from './../../common/constants/command.constant';
import { WizardQuestionType } from './../../common/types';
import { wizard } from './../wizards/base.wizard';
import { BaseCommand } from './base.command';
import { config } from '../../config/config';

export class ConfigCommand extends BaseCommand {
  constructor() {
    super(Command.Config, 'Used to configure your preferences');
  }

  async action(): Promise<void> {
    const ACTIONS_MAP = {
      eventsPath: 'eventsPath',
      displayFields: 'displayFields'
    };
    const { configItem } = await wizard.ask([
      new Question(
        'configItem',
        'Choose which config item you want to configure:',
        WizardQuestionType.List,
        {
          choices: [
            new Choice("Event's path", ACTIONS_MAP.eventsPath),
            new Choice('Display fields', ACTIONS_MAP.displayFields)
          ]
        }
      )
    ]);

    const nextStep = {
      [ACTIONS_MAP.eventsPath]: this.changeEventsPath.bind(this),
      [ACTIONS_MAP.displayFields]: this.changeDisplayFields.bind(this)
    };

    nextStep[configItem]?.();
  }

  async changeEventsPath(): Promise<void> {
    const { [config.eventsField]: eventsPath } = await wizard.ask([new EventsPathQuestion()]);

    await config.updateConfigProperty(config.eventsField, eventsPath);

    this.logger.info('Your events path successfully updated.');
  }

  async changeDisplayFields() {
    const { [config.defaultDisplayFieldsField]: defaultDisplayFields } = await wizard.ask([
      new DefaultDisplayFieldsQuestion()
    ]);

    await config.updateConfigProperty(config.defaultDisplayFieldsField, defaultDisplayFields);

    this.logger.info('Your default display fields successfully updated.');
  }
}
