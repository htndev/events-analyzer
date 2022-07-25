import { graphSerializer } from './../../serializer/graph.serializer';
import { blue, bold, underline, yellow } from '../../common/utils/console.util';
import { Command } from './../../common/constants/command.constant';
import {
  AnalyzeCriteria,
  GraphType,
  SYSTEM_ANALYZE_CRITERIA
} from './../../common/constants/options.constant';
import { getObjectValue } from './../../common/utils/object.util';
import { ByOption } from './../options/by.option';
import { DateRangeOption } from './../options/date-range.option';
import { GraphOption } from './../options/graph.option';
import { BaseCommand } from './base.command';

const rareEvents =
  (events: Record<string, number>) =>
  (rarestItems: string[], [key, value]: [string, number]) => {
    const minValue = events[rarestItems[0]] || Infinity;
    if (!rarestItems.length || value < minValue) {
      return [key];
    }

    if (value === minValue) {
      return [...rarestItems, key];
    }

    return rarestItems;
  };

const frequentEvents =
  (events: Record<string, number>) =>
  (frequentestItems: string[], [key, value]: [string, number]) => {
    const maxValue = events[frequentestItems[0]] || -Infinity;

    if (value > maxValue) {
      return [key];
    }

    if (value === maxValue) {
      return [...frequentestItems, key];
    }

    return frequentestItems;
  };

const MAP: { [k in Exclude<AnalyzeCriteria, AnalyzeCriteria.All>]: typeof rareEvents } = {
  [AnalyzeCriteria.Rare]: rareEvents,
  [AnalyzeCriteria.Frequent]: frequentEvents
};

export class GetCommand extends BaseCommand {
  constructor() {
    super(Command.Get, 'Used to receive events specified by growth (ascending or descending)', [
      ByOption,
      DateRangeOption,
      GraphOption
    ]);
  }

  async action(
    { by, dateRange, graph }: { by: ByOption; dateRange: DateRangeOption; graph: GraphOption },
    args: AnalyzeCriteria[]
  ): Promise<void> {
    const [criteria] = args;

    if (!criteria) {
      this.logger.error('No analyze criteria provided');
      return;
    }

    if (!SYSTEM_ANALYZE_CRITERIA.includes(criteria)) {
      this.logger.error(
        `You are using not existing '${
          by.value
        }' analyze criteria. You could use ${SYSTEM_ANALYZE_CRITERIA.join(', ')}`
      );
      return;
    }

    if (!by.value) {
      this.logger.error('No predicate provided.');
      return;
    }

    let events = await this.readEvents();

    if (!events) {
      return;
    }

    events = dateRange.perform(events);

    const styledCriteria = bold(underline(by.value));
    const groupedEvents = by.perform(events);

    if (criteria === AnalyzeCriteria.All) {
      const { events: frequentEvents, iterations: frequentIterations } = this.getEventByCriteria(
        groupedEvents,
        AnalyzeCriteria.Frequent
      );
      const { events: rareEvents, iterations: rareIterations } = this.getEventByCriteria(
        groupedEvents,
        AnalyzeCriteria.Rare
      );

      if (!graph.value) {
        this.logger.info(
          `The most frequent ${
            frequentEvents.length > 1
              ? `events are ${frequentEvents.map((fe) => blue(`'${fe}'`)).join(', ')}`
              : `event is ${blue(`'${frequentEvents[0]}'`)}`
          } published ${yellow(frequentIterations)} ${
            frequentIterations === 1 ? 'time' : 'times'
          } and the rarest ${
            rareEvents.length > 1
              ? `events are ${rareEvents.map((re) => blue(`'${re}'`)).join(', ')}`
              : `event is ${blue(`'${rareEvents[0]}'`)}`
          } published ${yellow(rareIterations)} ${
            rareIterations === 1 ? 'time' : 'times'
          } by criteria ${styledCriteria}`
        );

        return;
      }

      const GRAPH_DATE_BASE = [...rareEvents, ...frequentEvents].reduce(
        (total, field) => ({
          ...total,
          [field]: 0
        }),
        {}
      );

      const graphEventsData = events
        .filter((e) => {
          const value = getObjectValue(e, by.value as string) as string;

          return rareEvents.includes(value) || frequentEvents.includes(value);
        })
        .map((event) => ({
          value: getObjectValue(event, by.value as string) as string,
          date: event.timestamp.slice(0, 10)
        }))
        .sort((a, b) => (new Date(a.date) as any) - (new Date(b.date) as any))
        .reduce((total: any, event) => {
          const item = total[event.date] || { ...GRAPH_DATE_BASE };
          item[event.value]++;

          return {
            ...total,
            [event.date]: item
          };
        }, {});

      await this.createGraph(graphEventsData);

      return;
    }

    const { events: publishedEvents, iterations } = this.getEventByCriteria(
      groupedEvents,
      criteria
    );

    if (!graph.value) {
      const isSingleEvent = events.length < 2;

      this.logger.info(
        isSingleEvent
          ? `You have event '${publishedEvents[0]}'`
          : `You have events ${publishedEvents.map((e) => `'${e}'`).join(', ')}`,
        `published ${iterations} ${iterations < 2 ? 'time' : 'times'} by criteria ${styledCriteria}`
      );

      return;
    }

    const GRAPH_DATE_BASE = publishedEvents.reduce(
      (total, field) => ({
        ...total,
        [field]: 0
      }),
      {}
    );

    const graphEventsData = events
      .filter((e) => publishedEvents.includes(getObjectValue(e, by.value as string) as string))
      .map((event) => ({
        value: getObjectValue(event, by.value as string) as string,
        date: event.timestamp.slice(0, 10)
      }))
      .sort((a, b) => (new Date(a.date) as any) - (new Date(b.date) as any))
      .reduce((total: any, event) => {
        const item = total[event.date] || { ...GRAPH_DATE_BASE };
        item[event.value]++;

        return {
          ...total,
          [event.date]: item
        };
      }, {});

    await this.createGraph(graphEventsData);
  }

  private getEventByCriteria(events: Record<string, number>, criteria: AnalyzeCriteria) {
    const map = Object.entries(events);
    const filteredEvents = map.reduce(
      (MAP[criteria as Exclude<AnalyzeCriteria, AnalyzeCriteria.All>] as any)(events),
      [] as string[]
    );

    return {
      events: filteredEvents,
      iterations: events[filteredEvents[0]]
    };
  }

  private async createGraph(events: any): Promise<void> {
    await graphSerializer.stringify({ type: GraphType.Bar, events });
  }
}
