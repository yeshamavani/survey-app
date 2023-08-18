import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatBadgeModule} from '@angular/material/badge';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatChipsModule} from '@angular/material/chips';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatMenuModule} from '@angular/material/menu';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatTooltipModule} from '@angular/material/tooltip';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {DatePickerComponent} from './component/date-picker/date-picker.component';
import {InputBoxComponent} from './component/input-box/input-box.component';
import {InputButtonComponent} from './component/input-button/input-button.component';
import {SelectBoxComponent} from './component/select-box/select-box.component';
import {PipesModule} from './pipes/pipes.module';
import {MomentDateModule} from '@angular/material-moment-adapter';
import {MatListModule} from '@angular/material/list';
import {NgxMaskDirective} from 'ngx-mask';
import {NgCircleProgressModule} from 'ng-circle-progress';

@NgModule({
  declarations: [
    InputBoxComponent,
    SelectBoxComponent,
    InputButtonComponent,
    DatePickerComponent,
  ],
  exports: [
    InputBoxComponent,
    SelectBoxComponent,
    InputButtonComponent,
    DatePickerComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDatepickerModule,
    MatListModule,
    MatSelectModule,
    MatRadioModule,
    MatChipsModule,
    MatTooltipModule,
    MatBadgeModule,
    MatButtonModule,
    MomentDateModule,
    MatMenuModule,
    TranslateModule,
    PipesModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    MatExpansionModule,
    NgxMaskDirective,
    NgCircleProgressModule.forRoot({
      // set defaults here
      radius: 100,
      outerStrokeWidth: 16,
      innerStrokeWidth: 8,
      outerStrokeColor: '#78C000',
      innerStrokeColor: '#C7E596',
      animationDuration: 300,
    }),
  ],
})
export class ToolsModule {}
