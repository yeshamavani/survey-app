import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {NgxPermissionsModule} from 'ngx-permissions';
import {ApiModule} from './api/api.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule,
    ApiModule,
    NgxPermissionsModule.forRoot(),
  ],
  exports: [],
  providers: [],
})
export class CoreModule {}
