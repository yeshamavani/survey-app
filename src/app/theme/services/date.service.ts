import {Injectable} from '@angular/core';
import { Moment } from 'moment';
import * as moment from 'moment-timezone';

export enum DATE_FORMAT {
  DATE = 'DATE',
  TIME = 'TIME',
  DATE_TIME = 'DATE_TIME',
}
type DateFuncType = Date | number | string;
@Injectable({
  providedIn: 'root',
})
export class DateService {
  getDate(timestamp?: number | Date): Moment {
    if (!timestamp) {
      timestamp = moment().valueOf();
    }

    return moment.tz(timestamp, moment.tz.guess());
  }

  newDate(date?: number | Date): Date;
  newDate(date: string, format: string): Date;

  newDate(date?: DateFuncType, format?: string): Date {
    let newDate: Moment;
    if (format && typeof date === 'string') {
      newDate = this.getDateByApplicationTimezone(date, format);
    } else if (
      typeof date === 'undefined' ||
      typeof date === 'number' ||
      date instanceof Date
    ) {
      newDate = this.getDate(date);
    } else {
      newDate = moment(date);
    }
    return new Date(newDate.format('MM/DD/YYYY HH:mm:ss'));
  }

  getDateByApplicationTimezone(date: number | Date): Moment;

  getDateByApplicationTimezone(date: string, format: string): Moment;

  getDateByApplicationTimezone(date?: DateFuncType, format?: string): Moment {
    let currentTime: Moment;
    if (!date) {
      currentTime = this.getDate();
    } else if (typeof date === 'string') {
      currentTime = moment(date, format);
    } else {
      currentTime = moment(date);
    }
    const m = this.getDate();
    return m.set({
      year: currentTime.year(),
      month: currentTime.month(),
      date: currentTime.date(),
      hour: currentTime.hour(),
      minute: currentTime.minute(),
      second: currentTime.second(),
      millisecond: currentTime.millisecond(),
    });
  }

  getFormatedDate(date?: number | Date | string, format?: string): string {
    let newDate: Moment;
    if (format && typeof date === 'string') {
      newDate = this.getDateByApplicationTimezone(date, format);
    } else if (
      typeof date === 'undefined' ||
      typeof date === 'number' ||
      date instanceof Date
    ) {
      newDate = this.getDate(date);
    } else {
      newDate = moment(date);
    }

    return newDate.format(format);
  }
}
