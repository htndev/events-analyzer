import { GetCommand } from './commands/get.command';
import { program } from 'commander';
import { ClassType } from '../common/types';
import { bold, cyan, green } from '../common/utils/console.util';
import { config } from '../config/config';
import { BaseCommand } from './commands/base.command';
import { ConfigCommand } from './commands/config.command';
import { InitCommand } from './commands/init.command';
import { ListCommand } from './commands/list.command';
import { RetrieveCommand } from './commands/retrieve.command';

const COMMANDS: ClassType<BaseCommand>[] = [
  ListCommand,
  InitCommand,
  RetrieveCommand,
  ConfigCommand,
  GetCommand
].sort(
  // @ts-ignore
  (a, b) => a.name < b.name
);

class Application {
  private commands: ClassType<BaseCommand>[] = [];

  constructor(commands: ClassType<BaseCommand>[]) {
    this.commands = commands;
  }

  async setupApp() {
    program
      .name(bold(cyan(config.name)))
      .description(green(config.description))
      .version(config.version);
  }

  setupCommands() {
    this.commands.forEach((cmd) => {
      const command = new cmd();

      const comm = program.command(command.name);

      comm.description(command.description);

      command.options.forEach((option) => {
        const opt = new option();

        comm.option(opt.name, opt.description);
      });

      comm.action(command.callAction.bind(command));
    });
  }

  async setup() {
    await config.setup();
    await this.setupApp();
    this.setupCommands();
    program.parse();
  }
}

const app = new Application(COMMANDS);

export { app };
