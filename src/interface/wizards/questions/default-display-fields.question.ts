import { EventField, EventFieldTitle } from '../../../common/constants/event-field.constant';
import { WizardQuestionType } from '../../../common/types';
import { config } from '../../../config/config';
import { Choice } from '../choices/choice';
import { Question } from './base.question';

export class DefaultDisplayFieldsQuestion extends Question {
  constructor() {
    super(
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
          new Choice(EventFieldTitle[EventField.Browser], EventField.Browser, EventField.Browser),
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
    );
  }
}
