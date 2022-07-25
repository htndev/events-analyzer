import { WizardQuestionType } from '../../../common/types';
import { eventsPathValidator } from '../../../common/validators/events-path.validator';
import { config } from '../../../config/config';
import { Question } from './base.question';

export class EventsPathQuestion extends Question {
  constructor() {
    super(config.eventsField, 'Please, provide path for your events:', WizardQuestionType.Input, {
      validate: eventsPathValidator
    });
  }
}
