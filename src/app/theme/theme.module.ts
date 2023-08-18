import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';

import {ToolsModule} from './tools/tools.module';
import {DateService} from './services/date.service';
import {MatModule} from '../shared/material/mat.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {ClipboardModule} from '@angular/cdk/clipboard';
import {PipesModule} from './tools';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ToolsModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatModule,
    FlexLayoutModule,
    DragDropModule,
    ClipboardModule,
    PipesModule,
  ],
  exports: [MatModule, FormsModule, ReactiveFormsModule, ToolsModule],
  providers: [DateService],
})
export class ThemeModule {}
