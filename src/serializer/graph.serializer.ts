import { PieGraphEvent } from './../common/types';
import { GraphStructure, PossiblePromise } from '../common/types';
import { readFile } from '../common/utils/system.util';
import { GraphType } from './../common/constants/options.constant';
import { resolve, writeFileIntoZip } from './../common/utils/system.util';
import { BaseSerializer } from './base.serializer';

const BASE_TEMPLATE_PATH = resolve(__dirname, '..', 'template');

const gatherEvents = (events: string[]) =>
  events.reduce((total, event, index) => `${total}${index ? ', ' : ''}${event}`, '');

export class GraphSerializer extends BaseSerializer {
  parse(input: any) {}

  async stringify({ type, events }: GraphStructure): Promise<void> {
    const method = await this.graphMethod[type];
    const template = await method(events);
    await writeFileIntoZip(`${type}-chart.html`, template);
  }

  private async writePie(template: string, events: PieGraphEvent[]): Promise<string> {
    // @ts-ignore
    const gatheredByOccurrences = events.reduce((total: { [k: number]: string[] }, event) => {
      const evt = total[event.amount] || [];

      return {
        ...total,
        [event.amount]: [...evt, event.criteria]
      };
    }, {});

    const mappedOccurrences = Object.entries(gatheredByOccurrences).reduce(
      (total: PieGraphEvent[], [occurrence, events]) => [
        ...(total as PieGraphEvent[]),
        { criteria: gatherEvents(events), amount: +occurrence } as PieGraphEvent
      ],
      []
    );

    const stringifiedEvents = mappedOccurrences.reduce(
      (total: any, event) =>
        `${total}${total ? ',' : ''}['${event.criteria}', ${event.amount}]`,
      ''
    );
    return template.replace('{0}', stringifiedEvents);
    // console.log(stringifiedEvents);
  }

  private writeBar(
    template: string,
    events: { title: string; amount: number }[]
  ): string {
    // let template = await readFile(this.getFilePath(GraphType.Pie));
    // template = template.replace('{0}', events);
    return template.replace('{0}', JSON.stringify(events));
  }

  private async writeLine(
    template: string,
    events: { title: string; amount: number }[]
  ): Promise<void> {
    // let template = await readFile(this.getFilePath(GraphType.Pie));
    // template = template.replace('{0}', events);
    console.log(template);
    console.log(events);
  }

  private get graphMethod(): { [k in GraphType]: Promise<Function> } {
    return {
      [GraphType.Pie]: this.readTemplateDecorator(GraphType.Pie, this.writePie.bind(this)),
      [GraphType.Line]: this.readTemplateDecorator(GraphType.Line, this.writeLine.bind(this)),
      [GraphType.Bar]: this.readTemplateDecorator(GraphType.Bar, this.writeBar.bind(this))
    };
  }

  private getFilePath(type: GraphType): string {
    return resolve(BASE_TEMPLATE_PATH, `${type}.html`);
  }

  private async readTemplateDecorator(type: GraphType, fn: Function) {
    const template = await readFile(this.getFilePath(type));

    return (...args: any[]) => fn(template, ...args);
  }
}

export const graphSerializer = new GraphSerializer();
