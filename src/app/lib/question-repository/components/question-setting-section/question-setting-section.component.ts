import {
  Output,
  EventEmitter,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {ThemePalette} from '@angular/material/core';
import {MatDialog} from '@angular/material/dialog';
import {ComponentBase} from '../../../../core/component-base';
import {
  ConfirmDialogComponent,
  ConfirmationAction,
} from '../../../../shared/components';
import {APP_CONSTANTS} from '../../../..//shared/constants';
import {Subscription} from 'rxjs';
import {QuestionService} from '../../../survey-shared/services/question.service';
import {Question, ScoreOrFollowUp, QuestionType} from '../../models';

@Component({
  selector: 'app-question-setting-section',
  templateUrl: './question-setting-section.component.html',
  styleUrls: ['./question-setting-section.component.scss'],
})
export class QuestionSettingSectionComponent extends ComponentBase {
  @Output() closeDrawer = new EventEmitter();
  color: ThemePalette = 'primary';
  checked = false;
  disabled = false;
  question: Question;
  vendorDetailsForm: any;
  readonly scoreOrFollowUp = ScoreOrFollowUp;
  readonly questionType = QuestionType;
  questionLayoutType: {
    displayValue: string;
    value: QuestionType;
    src: string;
    disabled?: boolean;
  }[];
  depth: number;
  readonly folloupQuestionsLimit = APP_CONSTANTS.FOLLOWUP_QUESTIONS_LIMIT;
  apisubscriptions: Subscription[] = [];
  disableAllSelectedCheckbox = false;
  initialCategoryFetched = [];
  initialDomainFetched = [];
  initialVendorGroupFetched = [];

  constructor(
    private readonly questionService: QuestionService,
    private readonly fb: FormBuilder,
    private readonly cdRef: ChangeDetectorRef,
    public readonly dialog: MatDialog,
  ) {
    super();
    this.vendorDetailsForm = this.fb.group({
      questionType: [],
    });
    this.questionLayoutType = this.questionService.getQuestionType();
  }

  ngOnInit(): void {
    console.log(`YESHAAAA ---- ${this.questionType.DROP_DOWN}`);
    const typee = QuestionType.MULTI_SELECTION;
    console.log(`YESHAAAA22222 ---- ${typee}`);
    this._subscriptions.push(
      this.questionService.questionFocused.subscribe(data => {
        console.log(data);
        if (data.id) {
          this.clearAllApiSubscriptions();
          const {question, depth} = data;
          this.depth = depth;
          if (question) this.question = question;
          if (this.question?.parentQuestionId) {
            this.disableAllSelectedCheckbox = true;
          } else {
            this.disableAllSelectedCheckbox = false;
          }

          this.vendorDetailsForm
            ?.get('questionType')
            ?.setValue(question?.questionType);
          this.cdRef.detectChanges();
        }
      }),
    );
  }

  clearAllApiSubscriptions() {
    this.apisubscriptions.forEach(subscription => {
      if (subscription) {
        subscription.unsubscribe();
      }
    });
    this.apisubscriptions = [];
  }

  override ngOnDestroy(): void {
    this.clearAllApiSubscriptions();
    super.ngOnDestroy();
  }

  questionTypeDropdownClosed() {
    this.openChangeLayoutDialog();
  }

  openChangeLayoutDialog() {
    if (
      this.question?.questionType !==
      this.vendorDetailsForm?.get('questionType')?.value
    ) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '100%',
        maxWidth: '430px',
        panelClass: 'changeLayoutDialog',
        position: {
          top: '64px',
        },
        data: {
          dialogMsg: `Are you sure you want to switch question layout from  <b>${
            this.question?.questionType
          }}</b> to <b>${
            this.vendorDetailsForm.get('questionType')?.value
          }</b> ?`,
          footerNote: this.getWarningMsgForLayoutChange(),
          confirmationIcon: ConfirmationAction.WARNING,
          yesLabel: 'Confirm',
          noLabel: 'Cancel',
        },
      });
      this._subscriptions.push(
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.questionService.updatedQuestionType.next({
              questionType: this.vendorDetailsForm.get('questionType')?.value,
              id: this.question.id,
            });
          } else {
            this.vendorDetailsForm
              .get('questionType')
              ?.setValue(this.question?.questionType);
          }
        }),
      );
    }
  }

  getWarningMsgForLayoutChange() {
    if (
      this.vendorDetailsForm.get('questionType')?.value === QuestionType.TEXT
    ) {
      return this?.question?.questionType === QuestionType.SCALE
        ? ''
        : this.warningMsgForFollowupDelete();
    } else if (
      this.vendorDetailsForm.get('questionType')?.value === QuestionType.SCALE
    ) {
      return this?.question?.questionType === QuestionType.TEXT
        ? ''
        : this.warningMsgForFollowupDelete();
    } else {
      return '';
    }
  }

  warningMsgForFollowupDelete() {
    return this?.question?.followUpQuestions?.length
      ? 'This will delete all the answer options and follow up(s) for this question.'
      : 'This will delete all the answer options for this question.';
  }

  toggle(event: {checked: any}, scoreOrFollowUpValue: ScoreOrFollowUp) {
    if (!event.checked && scoreOrFollowUpValue === ScoreOrFollowUp.FOLLOWUP) {
      this.disableFollowUp(event, scoreOrFollowUpValue);
    } else {
      this.questionService.scoreOrFollowUpChange.next({
        id: this.question.id,
        change: scoreOrFollowUpValue,
        value: event.checked,
      });
    }
  }

  disableFollowUp(
    event: {checked: any},
    scoreOrFollowUpValue: ScoreOrFollowUp,
  ) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '100%',
      maxWidth: '430px',
      panelClass: 'allowSaveDialog',
      position: {
        top: '64px',
      },
      data: {
        dialogMsg: 'Are you sure you want to disable follow ups questions?',
        footerNote:
          'This will delete all the follow ups questions attached with the parent question.',
        confirmationIcon: ConfirmationAction.WARNING,
        yesLabel: 'Confirm',
        noLabel: 'Cancel',
      },
    });
    this._subscriptions.push(
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.questionService.scoreOrFollowUpChange.next({
            id: this.question.id,
            change: scoreOrFollowUpValue,
            value: event.checked,
          });
        } else {
          this.question.isFollowupEnabled = false;
          this.cdRef.detectChanges();
          this.question.isFollowupEnabled = true;
        }
      }),
    );
  }

  close() {
    this.questionService.questionIdOfFocusedQuestion = '';
    this.questionService.questionFocused.next({
      id: '',
      question: null,
      depth: 0,
    });
    this.closeDrawer.emit();
  }

  difference(arr1: any[], arr2: string | any[]) {
    return arr1.filter(e => !arr2.includes(e));
  }
}
