import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { DatePickerError } from "./date-picker-error.pipe";
import { FormatDatePipe } from "./format-date.pipe";
import { SliceDataPipe } from "./slice-data.pipe";


const PIPES = [
  FormatDatePipe,
  DatePickerError,
  SliceDataPipe
];
@NgModule({
  declarations: PIPES,
  providers: PIPES,
  imports: [CommonModule],
  exports: PIPES,
})
export class PipesModule {}
