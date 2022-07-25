import { Logger } from './../common/utils/logger.util';
import { doesFileExist, writeFile } from './../common/utils/system.util';
import { DISPLAY_FIELDS_SEPARATOR } from './../common/constants/options.constant';
import { EventField } from './../common/constants/event-field.constant';
import os from 'os';
import path from 'path';
import { readFile, readJSONSync } from '../common/utils/system.util';
import { Nullable, Optional, ValueType, ConfigType } from '../common/types';
import { configSerializer } from '../serializer/config.serializer';

class ApplicationConfig {
  readonly configFileName = '.analyze-eventsrc';
  readonly eventsField = 'events';
  readonly defaultDisplayFieldsField = 'defaultDisplayFieldsField';
  private config: Nullable<ConfigType> = null;

  constructor(private packageConfig: ConfigType) {}

  get version(): string {
    return this.packageConfig.version as string;
  }

  get description(): string {
    return this.packageConfig.description as string;
  }

  get name(): string {
    return this.packageConfig.name as string;
  }

  get homeDir(): string {
    return os.homedir();
  }

  get configurationPath(): string {
    return `${this.homeDir}/${this.configFileName}`;
  }

  get events(): Optional<ValueType> {
    return this.config?.[this.eventsField] as ValueType;
  }

  get defaultDisplayFields(): EventField[] | undefined {
    const cfg = this.config as ConfigType;
    return cfg[this.defaultDisplayFieldsField]
      ? (cfg[this.defaultDisplayFieldsField]
          .toString()
          .split(DISPLAY_FIELDS_SEPARATOR) as EventField[])
      : undefined;
  }

  async setup() {
    this.config = await this.readConfig();
  }

  async updateAllConfig(config: ConfigType): Promise<void> {
    await this.writeConfig(config);
  }

  async updateConfigProperty(property: string, value: string | string[]): Promise<void> {
    const config = (await this.readConfig()) as any;
    config[property] = value;

    await this.writeConfig(config);
  }

  async createConfig(config: ConfigType): Promise<void> {
    const doesConfigExist = await doesFileExist(this.configurationPath);

    if (doesConfigExist) {
      Logger.error('Config already exists.');
      return;
    }

    await this.writeConfig(config);
  }

  private async writeConfig(config: ConfigType): Promise<void> {
    await writeFile(this.configurationPath, configSerializer.stringify(config));
  }

  private async readConfig(): Promise<ConfigType> {
    const rawConfig = await readFile(this.configurationPath);
    const config = configSerializer.parse(rawConfig);

    return config;
  }
}

const pkg: ConfigType = readJSONSync(path.join(__dirname, '../../package.json')) as ConfigType;
const config = new ApplicationConfig(pkg);

export { config };
