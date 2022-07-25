import { DefaultDisplayFieldsQuestion } from './../wizards/questions/default-display-fields.question';
import { EventsPathQuestion } from './../wizards/questions/events-path.question';
import { bold } from 'chalk';
import { Command } from '../../common/constants/command.constant';
import { EventField, EventFieldTitle } from '../../common/constants/event-field.constant';
import { WizardQuestionType } from '../../common/types';
import { green } from '../../common/utils/console.util';
import { doesFileExist, writeFile } from '../../common/utils/system.util';
import { config } from '../../config/config';
import { configSerializer } from '../../serializer/config.serializer';
import { wizard } from '../wizards/base.wizard';
import { Choice } from '../wizards/choices/choice';
import { Question } from '../wizards/questions/base.question';
import { eventsPathValidator } from './../../common/validators/events-path.validator';
import { BaseCommand } from './base.command';

export class InitCommand extends BaseCommand {
  constructor() {
    super(Command.Init, 'Init analyze events tool');
  }

  async action(): Promise<void> {
    const hasFile = await doesFileExist(config.configurationPath);

    if (hasFile) {
      const { shouldProceed } = await wizard.ask([
        new Question(
          'shouldProceed',
          "You already have initialized event's path. Would you like to proceed with new initialization?",
          WizardQuestionType.Confirmation
        )
      ]);
      if (!shouldProceed) {
        return;
      }
    }

    const { [config.eventsField]: events, [config.defaultDisplayFieldsField]: displayFields } =
      await wizard.ask([new EventsPathQuestion(), new DefaultDisplayFieldsQuestion()]);

    await config.createConfig({
      [config.eventsField]: events,
      [config.defaultDisplayFieldsField]: displayFields
    });

    this.logger.info(
      'Successfully initialized your events! For more command enter',
      bold(green(`${config.name} --help`))
    );
  }
}
