import { SingleBar as BaseSingleBar } from 'cli-progress';
import { StyleFunction } from '../types';
import { bold, cyan } from '../utils/console.util';

export class SingleProgressBar {
  private readonly singleBar: BaseSingleBar;
  private initialValue = 0;
  private total = 0;

  constructor(
    title: string,
    range: { total: number; initialValue?: number },
    options: { stream?: NodeJS.ReadStream; style: StyleFunction } = {
      style: (s: string) => cyan(bold(s))
    }
  ) {
    this.singleBar = new BaseSingleBar({
      format: `${`[${title}]`} {bar} {percentage}% | ETA: {eta}s | {value}/{total}`,
      align: 'center',
      barCompleteChar: '\u2588',
      barIncompleteChar: '\u2591',
      stream: options.stream,
      stopOnComplete: true,
      clearOnComplete: true
    });

    this.initialValue = range.initialValue || 0;
    this.total = range.total || 0;
  }

  start() {
    this.singleBar.start(this.total, this.initialValue);
  }

  updateTotal(total: number) {
    this.singleBar.setTotal(total);
  }

  increment(value = 1) {
    this.singleBar.increment(value);
  }

  stop() {
    this.singleBar.stop();
  }
}
