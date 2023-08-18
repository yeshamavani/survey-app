import {Pipe, PipeTransform} from '@angular/core';
import * as moment from 'moment';
import {APP_CONSTANTS} from '../../../shared/constants';

@Pipe({
  name: 'trimIfString',
  pure: true,
})
export class TrimString implements PipeTransform {
  transform(value: moment.MomentInput) {
    if (
      moment(value, APP_CONSTANTS.DEFAULT_FULL_DATETIME_FORMAT, true).isValid()
    ) {
      return value;
    } else if (
      moment(
        value,
        APP_CONSTANTS.DEFAULT_FULL_DATETIME_FORMAT_WITH_MILLISEC,
        true,
      ).isValid() ||
      moment(
        value,
        APP_CONSTANTS.DEFAULT_FULL_DATETIME_FORMAT_WITH_TIMEZONE,
        true,
      ).isValid()
    ) {
      return moment(value).format(APP_CONSTANTS.DEFAULT_DATE_FORMAT);
    } else if (value && typeof value === 'string') {
      const str = value.replace(/,/g, ', ');
      const elem = new DOMParser().parseFromString(str, 'text/html');
      elem.querySelectorAll('td').forEach(td => {
        td.innerHTML = td.innerText + '&nbsp;';
      });
      return elem.documentElement.textContent?.trim();
    } else if (Array.isArray(value)) {
      return value.join(', ');
    } else {
      return value?.toString() ?? '';
    }
  }
}
