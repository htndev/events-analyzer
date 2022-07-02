import { prompt } from 'inquirer';
import { Question } from './questions/base.question';

export class BaseWizard {
  ask(questions: Question[]) {
    return prompt(this.parseQuestions(questions));
  }

  private parseQuestions(questions: Question[]) {
    return questions.map(q => q.valueOf());
  }
}

export const wizard = new BaseWizard();
