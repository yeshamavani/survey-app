import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatDrawer} from '@angular/material/sidenav';
import {ComponentBase} from '../../../../core/component-base';
import {APP_CONSTANTS} from '../../../../shared/constants';
import {ScrollPage} from '../../../question-repository/models';
import {QuestionService} from '../../services/question.service';

export interface ButtonConfigInterface {
  showHeader?: boolean;
  leftSection?: {matIconClass?: string; label: string; labelClass?: string};
  rightSection?: {
    matIconClass?: string;
    label: string;
    callback: () => {};
  };
  pagination?: {pages: number};
  showWeightSlider?: boolean;
  newQuestion?: {
    buttonLabel: string;
    isDisabled: boolean;
    options: {displayValue?: string; value?: string; src: string}[];
    callback: (option: any) => {};
  };
}

@Component({
  selector: 'app-questions-wrapper',
  templateUrl: './questions-wrapper.component.html',
  styleUrls: ['./questions-wrapper.component.scss'],
})
export class QuestionsWrapperComponent extends ComponentBase {
  @Input() buttonConfigurations: ButtonConfigInterface;
  @Input() showPaginationBar = true;
  @Output() toggleWeightage: EventEmitter<boolean> = new EventEmitter();
  @Input() questionsLength = 0;
  form: FormGroup;
  data: any[] = [];
  scrollId = APP_CONSTANTS.QUESTION_SCROLL_ID;
  scrollPage = ScrollPage;
  moreLogs = true;
  matToolTip: string;
  @Input() questionId = '';
  @Input() hasMarginBorder = true;
  @ViewChild('drawer', {static: false}) public drawer: MatDrawer;

  constructor(
    private readonly fb: FormBuilder,
    private readonly questionService: QuestionService,
  ) {
    super();
    this.form = this.fb.group({
      page: [],
    });
  }

  @Input() isWeightsEnabled = false;
  @Input() currentTotalWeight = 0;
  ngOnInit(): void {
    this.questionService.questionSelectedForScroll.subscribe(data => {
      this.form?.get('page')?.setValue(data.page);
    });
  }

  enableWeights() {
    this.isWeightsEnabled = !this.isWeightsEnabled;
    this.toggleWeightage.emit(this.isWeightsEnabled);
  }
}
