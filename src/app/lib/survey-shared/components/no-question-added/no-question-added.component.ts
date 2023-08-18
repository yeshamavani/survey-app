import {Component, EventEmitter, Input, Output} from '@angular/core';
import {QuestionType} from '../../models/common.model';

@Component({
  selector: 'app-no-question-added',
  templateUrl: './no-question-added.component.html',
  styleUrls: ['./no-question-added.component.scss'],
})
export class NoQuestionAddedComponent {
  @Input() dropAreaSubtitle: string;
  @Input() showAddButton = false;
  @Input() options: {displayValue: string; value: QuestionType; src: string}[] =
    [];
  @Output() addNew = new EventEmitter();

  selectLayout(value: QuestionType) {
    this.addNew.emit(value);
  }
}
