import {NgModule} from '@angular/core';
import {SurveyUiComponent} from './survey-ui.component';
import {SurveyUiRoutingModule} from './survey-ui.routing.module';
import {ThemeModule} from '../theme/theme.module';
import {QuestionRepositoryModule} from './question-repository/question-repository.module';
import {SurveySharedModule} from './survey-shared/survey-shared.module';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  declarations: [SurveyUiComponent],
  imports: [SurveyUiRoutingModule, RouterModule],
  exports: [
    SurveyUiComponent,
    SharedModule,
    SurveySharedModule,
    ThemeModule,
    QuestionRepositoryModule,
  ],
})
export class SurveyUiModule {}
