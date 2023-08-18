import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ComponentBase} from '../../../../core/component-base';
import {QuestionTypeAndSection} from '../../../question-repository/models';

@Component({
  selector: 'app-question-drop-section',
  templateUrl: './question-drop-section.component.html',
  styleUrls: ['./question-drop-section.component.scss'],
})
export class QuestionDropSectionComponent extends ComponentBase {
  @Input() showButton = false;
  @Input() buttonText: string | undefined = '';
  @Input() titleText: string;
  @Input() subTitleText: string;
  @Input() img = 'assets/images/clm-images/no-data-found/empty-drop-area.svg';
  @Input() showWrapper = true;
  @Input() showLayoutOptionsForFollowUp = false;
  @Output() cancelEvent = new EventEmitter();
  @Output() followUpLayout = new EventEmitter();
  questionLayoutOptions: {
    displayValue: string;
    value: QuestionTypeAndSection;
    src: string;
  }[];
  constructor() {
    super();
  }

  ngOnInit() {
    this.questionLayoutOptions = [
      {
        displayValue: 'Multi Selection',
        value: QuestionTypeAndSection.MULTI_SELECTION,
        src: 'assets/images/clm-images/survey/checkbox-Outline.svg',
      },
      {
        displayValue: 'Single Selection',
        value: QuestionTypeAndSection.SINGLE_SELECTION,
        src: 'assets/images/clm-images/survey/radio-Outline.svg',
      },
      {
        displayValue: 'Text',
        value: QuestionTypeAndSection.TEXT,
        src: 'assets/images/clm-images/survey/short-text-Outline.svg',
      },
      {
        displayValue: 'Drop Down',
        value: QuestionTypeAndSection.DROP_DOWN,
        src: 'assets/images/clm-images/survey/drop-down.svg',
      },
      {
        displayValue: 'Scale',
        value: QuestionTypeAndSection.SCALE,
        src: 'assets/images/clm-images/survey/scale.svg',
      },
    ];
    if (this.showLayoutOptionsForFollowUp) {
      this.titleText = 'Select Follow Up Question';
      this.subTitleText = 'Select the layout element from the dropdown.';
    }
  }
  selectedFollowUpLayout(value: any) {
    this.followUpLayout.emit(value);
  }

  cancel() {
    this.cancelEvent.emit();
  }
}
