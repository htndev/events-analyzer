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
      await wizard.ask([
        new Question(
          config.eventsField,
          'Please, provide path for your events:',
          WizardQuestionType.Input,
          { validate: eventsPathValidator }
        ),
        new Question(
          config.defaultDisplayFieldsField,
          'Please, select fields which you would like to see in output (Optional, you can leave it empty and use default outputs)',
          WizardQuestionType.MultipleCheck,
          {
            choices: [
              new Choice(EventFieldTitle[EventField.Id], EventField.Id, EventField.Id),
              new Choice(EventFieldTitle[EventField.Action], EventField.Action, EventField.Action),
              new Choice(EventFieldTitle[EventField.Value], EventField.Value, EventField.Value),
              new Choice(
                EventFieldTitle[EventField.Category],
                EventField.Category,
                EventField.Category
              ),
              new Choice(
                EventFieldTitle[EventField.Browser],
                EventField.Browser,
                EventField.Browser
              ),
              new Choice(EventFieldTitle[EventField.Device], EventField.Device, EventField.Device),
              new Choice(EventFieldTitle[EventField.Email], EventField.Email, EventField.Email),
              new Choice(
                EventFieldTitle[EventField.FirstName],
                EventField.FirstName,
                EventField.FirstName
              ),
              new Choice(
                EventFieldTitle[EventField.LastName],
                EventField.LastName,
                EventField.LastName
              ),
              new Choice(EventFieldTitle[EventField.OS], EventField.OS, EventField.OS),
              new Choice(EventFieldTitle[EventField.Tags], EventField.Tags, EventField.Tags),
              new Choice(
                EventFieldTitle[EventField.Timestamp],
                EventField.Timestamp,
                EventField.Timestamp
              ),
              new Choice(EventFieldTitle[EventField.Uid], EventField.Uid, EventField.Uid)
            ]
          }
        )
      ]);

    const newConfig = configSerializer.stringify({
      [config.eventsField]: events,
      [config.defaultDisplayFieldsField]: displayFields
    });

    await writeFile(config.configurationPath, newConfig);

    this.logger.info(
      'Successfully initialized your events! For more command enter',
      bold(green(`${config.name} --help`))
    );
  }
}
