import {NgModule} from '@angular/core';
import {
  AddEditQuestionsComponent,
  QuestionLayoutSectionComponent,
  QuestionSettingSectionComponent,
} from './components';
import {QuestionRepositoryComponent} from './question-repository.component';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatBadgeModule} from '@angular/material/badge';
import {NgxPermissionsModule} from 'ngx-permissions';
import {SharedModule} from '../../shared/shared.module';
import {ThemeModule} from '../../theme/theme.module';
import {ToolsModule} from '../../theme/tools/tools.module';
import {QuestionRepositoryRoutingModule} from './question-repository-routing.module';
import {SurveySharedModule} from '../survey-shared/survey-shared.module';

@NgModule({
  declarations: [
    QuestionRepositoryComponent,
    AddEditQuestionsComponent,
    QuestionLayoutSectionComponent,
    QuestionSettingSectionComponent,
  ],
  imports: [
    SurveySharedModule,
    QuestionRepositoryRoutingModule,
    NgxPermissionsModule.forChild(),
    ThemeModule,
    FormsModule,
    MatBadgeModule,
    MatAutocompleteModule,
    SharedModule,
    ToolsModule,
    CommonModule,
  ],
  providers: [],
  exports: [
    QuestionRepositoryComponent,
    AddEditQuestionsComponent,
    QuestionLayoutSectionComponent,
    QuestionSettingSectionComponent,
  ],
})
export class QuestionRepositoryModule {}
