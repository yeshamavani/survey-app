import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {CustomToastrComponent} from './custom-toastr.component';
import {ToastrModule} from 'ngx-toastr';
import {MatIconModule} from '@angular/material/icon';
import {FlexLayoutModule} from '@angular/flex-layout';

@NgModule({
  declarations: [CustomToastrComponent],
  imports: [
    CommonModule,
    FormsModule,
    ToastrModule.forRoot({
      preventDuplicates: true,
      toastComponent: CustomToastrComponent,
    }),
    MatIconModule,
    FlexLayoutModule,
  ],
  exports: [CustomToastrComponent],
})
export class CustomToastrModule {}
