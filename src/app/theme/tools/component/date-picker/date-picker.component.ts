import {
  Component,
  OnInit,
  Input,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import {FormControl} from '@angular/forms';
import {
  ErrorStateMatcher,
  MAT_DATE_FORMATS,
  ShowOnDirtyErrorStateMatcher,
} from '@angular/material/core';
import {MatDatepicker} from '@angular/material/datepicker';
import * as moment from 'moment-timezone';
import {FILTER_DATE_FORMATS} from '../../../../shared/constants';
import {APP_CONSTANTS} from '../../../../shared/constants/global-constants';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
  providers: [
    {provide: MAT_DATE_FORMATS, useValue: FILTER_DATE_FORMATS},
    {provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher},
  ],
})
export class DatePickerComponent implements OnInit {
  @ViewChild('picker')
  public picker: MatDatepicker<Date>;

  @Input() validateArray: any = {}; //NOSONAR
  @Input() placeholder = '';
  @Input() control: FormControl;
  @Input() value!: string | Date | null;
  @Input() format = APP_CONSTANTS.DEFAULT_DATE_FORMAT;
  @Input() required = false;
  @Input() setUTC12PM = true;
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() id = '';
  @Input() minDate = '';
  @Input() maxDate = '';
  @Output() dateChanged: EventEmitter<string> = new EventEmitter<string>();
  @Input() minDateErrorMessage = '';
  ngOnInit(): void {
    // intentional
  }

  constructor() {}

  onDateChange(e: {target: {value: moment.MomentInput}}) {
    let convertDate = moment(e.target.value).format();
    if (this.setUTC12PM) {
      convertDate = this.addTimezoneOffset(convertDate);
    }
    this.value = moment(convertDate).format(this.format);
    if (this.control) {
      this.control.setValue(convertDate);
    }
    this.dateChanged.emit(this.value);
  }

  clearDate() {
    this.value = null;
    if (this.control) {
      this.control.setValue(null);
      this.control.markAsDirty();
      this.control.markAsTouched();
    }
    this.dateChanged.emit('');
  }

  addTimezoneOffset(date: string) {
    const onlyDate = moment(date).format('YYYY-MM-DD');
    return moment.tz(onlyDate, 'utc').set({hour: 12}).local().format();
  }

  removeFocus() {
    this.picker.restoreFocus = false;
  }
}
