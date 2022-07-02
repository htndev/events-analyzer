import { pathExists, lstat } from 'fs-extra';
import inquirer, { QuestionCollection } from 'inquirer';

type Validator = (input: string, answers?: Record<string, any>) => Promise<string | boolean>;

export class Question {
  constructor(
    public readonly name: string,
    public readonly message: string,
    public readonly type: string,
    public readonly options: {
      // choices?: Choice[];
      validate?: Validator;
    } = {}
  ) {}

  valueOf() {
    return {
      name: this.name,
      message: this.message,
      type: this.type,
      // ...(this.options.choices && { choices: this.options.choices }),
      ...(this.options.validate && { validate: this.options.validate })
    };
  }
}

const ask = () => {
  const questions: QuestionCollection = [
    {
      name: 'eventsPath',
      type: 'input',
      message: 'Specify path to the events',
      async validate(input) {
        if (!(await pathExists(input))) {
          return `Unfortunately, I can't find file by path '${input}'`;
        }
        const stats = await lstat(input);

        return stats.isFile() || 'You should specify path to file, not directory';
      }
    },
    (new Question('evev', 'input', 'message', { validate: async () => 'hui' })).valueOf(),
    {
      name: 'defaultDisplayFields',
      type: 'checkbox',
      message: 'Please, select fields which you want to see as output',
      choices: [
        {
          name: 'id',
          value: 'id'
        },
        {
          name: 'action',
          value: 'action'
        },
        {
          name: 'category',
          value: 'category'
        },
        {
          name: 'Device',
          value: 'meta.device'
        }
      ]
    }
  ];
  return inquirer.prompt(questions);
};

const run = async () => {
  const { eventsPath, defaultDisplayFields } = await ask();

  // console.log(eventsPath, defaultDisplayFields);
};

run();
