import { eventsPathValidator } from './../../common/validators/events-path.validator';
import { Choice } from '../wizards/choices/choice';
import { Question } from '../wizards/questions/base.question';
import { Command } from './../../common/constants/command.constant';
import { WizardQuestionType } from './../../common/types';
import { wizard } from './../wizards/base.wizard';
import { BaseCommand } from './base.command';

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

  async changeEventsPath() {
    const { eventsPath } = await wizard.ask([
      new Question('eventsPath', 'Please, specify path to he event:', WizardQuestionType.Input, {
        validate: eventsPathValidator
      })
    ]);

    console.log(eventsPath);
  }

  changeDisplayFields() {
    console.log('Display fields');
  }
}
