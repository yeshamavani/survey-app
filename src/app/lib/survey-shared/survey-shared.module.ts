import {ScrollingModule} from '@angular/cdk/scrolling';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatBadgeModule} from '@angular/material/badge';
import {AgGridModule} from 'ag-grid-angular';
import {SharedModule} from '../../shared/shared.module';
import {ThemeModule} from '../../theme/theme.module';
import {ToolsModule} from '../../theme/tools/tools.module';
import {
  QuestionsWrapperComponent,
  QuestionCardComponent,
  QuestionDropSectionComponent,
  NoQuestionAddedComponent,
} from './components';
import {
  TargetStringLength,
  CircleProgressColorPipe,
  CheckAnyOptionsHasDroppable,
} from './pipes';
import {QuestionOrderWithCount} from './pipes/question-order-with-count.pipe';
import {ShowFollowupQuestion} from './pipes/show-followup-question.pipe';
import {QuestionService} from './services/question.service';
import {NgCircleProgressModule} from 'ng-circle-progress';

@NgModule({
  declarations: [
    QuestionsWrapperComponent,
    QuestionCardComponent,
    QuestionDropSectionComponent,
    QuestionOrderWithCount,
    TargetStringLength,
    ShowFollowupQuestion,
    CheckAnyOptionsHasDroppable,
    CircleProgressColorPipe,
    NoQuestionAddedComponent,
  ],
  providers: [
    QuestionService,
    QuestionOrderWithCount,
    TargetStringLength,
    ShowFollowupQuestion,
    CircleProgressColorPipe,
    CheckAnyOptionsHasDroppable,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ThemeModule,
    ToolsModule,
    FormsModule,
    MatBadgeModule,
    MatAutocompleteModule,
    ScrollingModule,
    AgGridModule,
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
  exports: [
    QuestionsWrapperComponent,
    QuestionCardComponent,
    QuestionDropSectionComponent,
    QuestionOrderWithCount,
    ShowFollowupQuestion,
    CheckAnyOptionsHasDroppable,
    CircleProgressColorPipe,
    NoQuestionAddedComponent,
  ],
})
export class SurveySharedModule {}
