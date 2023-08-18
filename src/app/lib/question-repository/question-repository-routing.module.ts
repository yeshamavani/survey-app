import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AddEditQuestionsComponent} from './components';

const routes: Routes = [
  {
    path: 'add-edit',
    component: AddEditQuestionsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuestionRepositoryRoutingModule {}
