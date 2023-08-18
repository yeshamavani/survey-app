import {Pipe, PipeTransform} from '@angular/core';
import {FormControl} from '@angular/forms';
@Pipe({
  name: 'datePickerError',
  pure: false,
})
export class DatePickerError implements PipeTransform {
  constructor() {
    // Intentional
  }
  transform(control: FormControl, validateArray:any, minDateErrorMessage: string) {
    if (control.hasError('matDatepickerMin'))
      return (
        minDateErrorMessage || 'Select Valid Date'
      );
    return control.hasError('required')
      ? validateArray.hasOwnProperty('required')
        ? validateArray.required
        : 'Please Select date'
      : control.hasError('email')
      ? validateArray.hasOwnProperty('email')
        ? validateArray.email
        : 'Invalid Email'
      : control.hasError('pattern')
      ? validateArray.hasOwnProperty('pattern')
        ? validateArray.pattern
        : 'Invalid Value'
      : control.hasError('rangeError')
      ? validateArray.hasOwnProperty('rangeError')
        ? validateArray.pattern
        : 'Invalid Date Range'
      : '';
  }
}
