import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {NgxPermissionsGuard} from 'ngx-permissions';
import {AUTH_REQUIRED_PAGE} from '../shared/constants';
import {PermissionKey} from '../core/api/models/enums/permission-key.enum';
import {SurveyUiComponent} from './survey-ui.component';
const routes = [
  {
    path: '',
    component: SurveyUiComponent,
    children: [
      {
        path: 'questions',
        canActivate: [NgxPermissionsGuard],
        data: {
          routerLinkPath: `main/questions/list`,
          permissions: {
            only: [PermissionKey.ViewQuestion],
            redirectTo: {
              navigationCommands: [AUTH_REQUIRED_PAGE],
            },
          },
        },

        loadChildren: () =>
          import('./question-repository/question-repository.module').then(
            m => m.QuestionRepositoryModule,
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SurveyUiRoutingModule {}
