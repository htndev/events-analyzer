import { format } from 'date-fns';

export class CustomDate {
  date: Date;

  constructor(date: string) {
    this.date = new Date(date);
  }

  get formatted(): string {
    return format(this.date, 'HH:mm:ss dd LLL yyyy');
  }
}
