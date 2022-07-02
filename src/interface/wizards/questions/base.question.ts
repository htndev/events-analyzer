import { Choice } from '../choices/choice';
import { WizardQuestionType, PossiblePromise } from '../../../common/types';

type Validator = (
  input: string,
  answers?: Record<string, any>
) => PossiblePromise<string | boolean>;

export class Question {
  constructor(
    public readonly name: string,
    public readonly message: string,
    public readonly type: WizardQuestionType,
    public readonly options: {
      choices?: Choice[];
      validate?: Validator;
    } = {}
  ) {}

  valueOf() {
    return {
      name: this.name,
      message: this.message,
      type: this.type,
      ...(this.options.choices && { choices: this.options.choices }),
      ...(this.options.validate && { validate: this.options.validate })
    };
  }
}
