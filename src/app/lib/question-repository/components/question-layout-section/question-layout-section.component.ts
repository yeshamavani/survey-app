import {Component} from '@angular/core';
import {QuestionService} from '../../../survey-shared/services/question.service';
import {QuestionType} from '../../models';

@Component({
  selector: 'app-question-layout-section',
  templateUrl: './question-layout-section.component.html',
  styleUrls: ['./question-layout-section.component.scss'],
})
export class QuestionLayoutSectionComponent {
  questionLayoutType: {
    displayValue: string;
    value: QuestionType;
    src: string;
  }[];
  constructor(private readonly questionService: QuestionService) {
    this.questionLayoutType = this.questionService.getQuestionType();
  }
}
