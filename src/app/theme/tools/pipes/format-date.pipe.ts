import {Pipe, PipeTransform} from '@angular/core';
import * as moment from 'moment';
import { DateService } from '../../services/date.service';

@Pipe({
  name: 'formatDate',
})
export class FormatDatePipe implements PipeTransform {
  constructor(private dateService: DateService) {}

  transform(date: number | Date | string, format?: string) {
    if (!date || !moment(date).isValid()) {
      return null;
    }
    date = moment(date).format();
    if (typeof date === 'string') {
      if (Number(date)) {
        date = Number(date);
      }
    }

    if (typeof date === 'string') {
      if (format) {
        return this.dateService.getFormatedDate(date, format);
      } else {
        return null;
      }
    } else {
      if (format) {
        return this.dateService.getDate(date).format(format);
      } else {
        return this.dateService.getFormatedDate(date);
      }
    }
  }
}
