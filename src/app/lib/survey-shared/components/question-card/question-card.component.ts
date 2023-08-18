import {
  Input,
  Output,
  EventEmitter,
  ViewChildren,
  QueryList,
  ChangeDetectorRef,
  NgZone,
  SimpleChanges,
  Component,
  Inject,
} from '@angular/core';
import {FormGroup, FormBuilder, Validators, FormArray} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute} from '@angular/router';
import {round, orderBy} from 'lodash';
import {ToastrService} from 'ngx-toastr';
import {ComponentBase} from '../../../..//core/component-base';
import {
  ConfirmDialogComponent,
  ConfirmationAction,
} from '../../../..//shared/components';
import {APP_CONSTANTS} from '../../../..//shared/constants';
import {ngDebounce} from '../../../..//shared/decorators/debounce.decorator';
import {
  Question,
  Mode,
  QuestionType,
  QuestionStatus,
  ScoreOrFollowUp,
  Options,
} from '../../../question-repository/models';
import {QuestionService} from '../../services/question.service';
import {uptoDecimalPlaces} from '../../../../shared/functions/validation.service';
import {QuestionPayload} from '../../../question-repository/models/question-payload.model';
import {QuestionUtilityService} from '../../services/question-utility.service';
import {IQuestionProxyService} from '../../types';
export const QuestionOptionForm = {
  score: 'score',
  option: 'option',
};
const UPTO_DECIMAL_PLACE = 2;

@Component({
  selector: 'app-question-card',
  templateUrl: './question-card.component.html',
  styleUrls: ['./question-card.component.scss'],
})
export class QuestionCardComponent extends ComponentBase {
  @Input() question: Question;
  @Input()
  missingFieldError!: string;
  @Input() highlightQuestion = false;
  @Input()
  questionCount!: number;
  @Input()
  depth!: number;
  @Input()
  order!: number;
  @Input() mode: Mode;
  @Input() hasCustomDelete = false;
  @Input() showDelete = true;
  @Input() selectQuestionsOnReadOnly = false;
  @Input() displayQuestionCountWithTotal = false;
  @Input() hideQuestionCount = false;
  @Input() showQuestionType = true;
  @Input() showQuestionTopHeader = true;
  @Input() orderOfSectionsQuestion = 0;
  /**
   * In case @showQuestionWeightage is true pass @rootQuestionWeight
   * If @mode is true along with @showQuestionWeightage, then pass @maximumAllowedWeightage as well
   */
  @Input() showQuestionWeightage = false;
  @Input()
  rootQuestionWeight!: number;
  @Input()
  maximumAllowedWeightage!: number;
  @Input() editWeightage = false;
  @Input() showWeightageWithRootQuestion = false;
  @Input() selectAndFocusQuestion = true;
  @Input() isMandatory = null;
  @Input() showErrorOnAddingQuestionOnOptions = true;
  @Input() enableQuestionsDragging = false;
  @Input() dependentOnQuestionId = null;
  @Input() dependentQuestionNumber: any;
  @Input() isOtherQuestionHasDependency: any;
  @Input() showDuplicate = false;
  @Input()
  scrollId!: string;
  @Output() clickEvent = new EventEmitter();
  @Output() deleteEvent: EventEmitter<{
    question: Question;
    showDependencyAlert: boolean;
  }> = new EventEmitter();
  @Output() weightageValueEvent: EventEmitter<number> = new EventEmitter();
  @Output() surveyResponse: EventEmitter<{
    question: Question;
    surveyAnswer: string[] | string;
  }> = new EventEmitter();
  @ViewChildren(QuestionCardComponent)
  questionCardComponents!: QueryList<QuestionCardComponent>;
  @Output() recalculateChildrenCount = new EventEmitter();

  questionOptionForm = QuestionOptionForm;
  childrenCount = 0;
  modalForm: any;
  weightageForm: FormGroup;
  tenantId: string;
  readonly questionsType = QuestionType;
  questionStatus = QuestionStatus;
  questionDisplayText = '';
  parentQuestionData: Question;
  maxLengthErrorText = '';
  minLengthErrorText = '';
  dependentOnQuestion: Question | null;
  displayOrderString: string;

  isQuestionFocused = false;
  readonly modeEnum = Mode;

  maxSafeInt = Math.round(Number.MAX_SAFE_INTEGER / APP_CONSTANTS.HUNDRED);
  followUpIcon = '';
  questionResponse = {};
  showLayoutOptionsForFollowUp = false;
  questionTitleMaxLength = APP_CONSTANTS.THOUSAND;
  questionTitleMinLength = APP_CONSTANTS.THREE;
  showErrorMsg: boolean;
  infoMessage: string;
  constructor(
    private readonly fb: FormBuilder,
    @Inject('questionProxyService')
    private questionProxyService: IQuestionProxyService,

    private readonly questionService: QuestionService,
    private readonly questionUtilityService: QuestionUtilityService,

    protected readonly route: ActivatedRoute,
    protected readonly location: Location,
    private readonly cdRef: ChangeDetectorRef,
    private readonly dialog: MatDialog,
    private readonly toastr: ToastrService,
    protected readonly ngZone: NgZone,
  ) {
    super();
    const folloUpIcon = `<img class="follow-up-icon"
    src='assets/images/clm-images/survey/node-Outline.svg',
    )}
/>`;
    this.followUpIcon = `You can add follow up question, linked to a specific option of a question by\nselecting ${folloUpIcon} icon to clarify or elicit further information.`;

    this.modalForm = this.fb.group({
      name: [
        '',
        [
          Validators.maxLength(APP_CONSTANTS.THOUSAND),
          Validators.minLength(APP_CONSTANTS.THREE),
        ],
      ],
      optionsArray: this.fb.array([this.optionsControl()]),
    });

    this.weightageForm = this.fb.group({
      value: [
        this.rootQuestionWeight || 0,
        [
          uptoDecimalPlaces(UPTO_DECIMAL_PLACE),
          Validators.max(this.maxSafeInt),
        ],
      ],
    });
    this.maxLengthErrorText = `Maximum characters allowed: ${APP_CONSTANTS.THOUSAND}`;
    this.minLengthErrorText = `Minimum characters required: ${APP_CONSTANTS.THREE}`;
  }

  optionsControl(name = null) {
    return this.fb.group({
      option: [name],
      score: [
        null,
        [
          uptoDecimalPlaces(UPTO_DECIMAL_PLACE),
          Validators.max(this.maxSafeInt),
        ],
      ],
    });
  }

  ngOnInit(): void {
    if (this.question?.surveyId) {
      this.showLayoutOptionsForFollowUp = true;
    }
    this.displayOrderString = `Question ${this.order} of ${this.questionCount}`;
    this.parentQuestionData =
      this.questionService?.flatQuestionsMap?.[this.question?.parentQuestionId];
    this.modalForm?.get('name')?.setValue(this.question.name || '');
    this.setDependentQuestion();
    this.updateDataFromSettingSection();
    this.updateQuestionDisplayText();
    if (this.mode === Mode.RESPONSE || this.mode === Mode.RESPONSE_VIEW) {
      this.updateFollowupInfoText();
    }
  }

  setDependentQuestion() {
    this.dependentOnQuestion = this.dependentOnQuestionId
      ? this.questionService.flatQuestionsMap[this.dependentOnQuestionId]
      : null;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['order'] || changes['questionCount']) {
      this.updateQuestionDisplayText();
    }
    if (changes.hasOwnProperty('rootQuestionWeight')) {
      this.weightageForm?.get('value')?.setValue(this.rootQuestionWeight || 0);
    }
    if (changes.hasOwnProperty('maximumAllowedWeightage')) {
      this.maximumAllowedWeightage = round(
        this.maximumAllowedWeightage,
        APP_CONSTANTS.TWO,
      );
    }
    if (changes.hasOwnProperty('dependentOnQuestionId')) {
      this.setDependentQuestion();
    }
    this.calculateChildrenCount();
  }

  addOptions() {
    for (let i = 1; i < this.question.options.length; i++) {
      this.optionsArray.push(this.optionsControl());
    }
    this.optionsArray?.controls?.forEach((control, i) => {
      control
        ?.get(this.questionOptionForm.option)
        ?.setValue(this.question?.options[i]?.name);
      control
        ?.get(this.questionOptionForm.score)
        ?.setValue(this.question?.options[i]?.score);
    });
    this.cdRef.detectChanges();
  }

  ngAfterViewInit(): void {
    this.calculateChildrenCount();
  }

  updateFollowupInfoText() {
    if (this.question.parentQuestionId) {
      if (
        this.parentQuestionData.questionType === QuestionType.TEXT ||
        this.parentQuestionData.questionType === QuestionType.SCALE
      ) {
        this.infoMessage = `On the basis of answer given in question "<b>${this.parentQuestionData?.name}</b>", please answer below question.`;
      } else {
        this.infoMessage = `On the basis of selected answer "<b>${this.question?.followUpOption?.name}</b>, it is the follow up question you have to respond.`;
      }
    }
  }

  recalculateChildrenCountFn() {
    setTimeout(() => {
      this.calculateChildrenCount();
      this.recalculateChildrenCount.emit();
    }, APP_CONSTANTS.FIVE_HUNDRED);
  }

  calculateChildrenCount() {
    let count = this.question?.followUpQuestions?.length || 0;
    this.questionCardComponents?.forEach(quest => {
      count += quest.childrenCount;
    });
    this.childrenCount = count;
  }

  updateQuestionDisplayText() {
    this.questionDisplayText = `Question {this.order} of {this.questionCount}`;
  }

  updateDataFromSettingSection() {
    this._subscriptions.push(
      this.questionService.questionFocused.subscribe(data => {
        if (data.id === this.question.id) {
          this.isQuestionFocused = true;
        } else {
          this.isQuestionFocused = false;
        }
      }),
      this.questionService.focusQuestionOnPageChange.subscribe(data => {
        if (
          !this.question.parentQuestionId &&
          this.questionService.questionIdOfFocusedQuestion !==
            this.question.id &&
          data.page === this.order
        ) {
          this.questionService.questionIdOfFocusedQuestion = this.question.id;
          this.isQuestionFocused = true;
          this.openSettingsDrawer();
        } else {
          this.isQuestionFocused = false;
        }
      }),
      this.questionService.scoreOrFollowUpChange.subscribe(data => {
        if (data.change === ScoreOrFollowUp.SCORE) {
          if (this.question.id === data.id) {
            this.updateQuestion({
              isScoreEnabled: data.value,
            });
            if (data.value) {
              this.resetAllScores();
            }
            this.question.isScoreEnabled = data.value;
          }
        } else {
          if (this.question.id === data.id) {
            const ids: string[] | undefined = [];
            if (!data.value) {
              this.questionService.getFollowUpIdsids(
                this.question.followUpQuestions,
                ids,
              );
              this.questionUtilityService.setFollowupQuestionIdAsNullWhenFollowupDisable(
                this.question,
                this._subscriptions,
                ids,
                this.deleteAllFollowUps.bind(this),
              );
            }
            this.updateQuestion({
              isFollowupEnabled: data.value,
            });
            this.question.isFollowupEnabled = data.value;
            this.question.options.forEach((_opt, i) => {
              this.question.options[i].showDroppable = false;
              this.question.options[i].followupQuestionId = '';
            });
          }
        }
      }),
      this.questionService.updatedOptions.subscribe(data => {
        if (data.questionId === this.question.id) {
          this.optionsArray.controls.length = 0;
          this.optionsArray.push(this.optionsControl());
          this.addOptions();
        }
      }),
      this.questionService.updatedQuestionType.subscribe(data => {
        if (this.question.id === data.id) {
          this.actionOnQuestionLayoutUpdate(data);
        }
      }),
    );
  }

  actionOnQuestionLayoutUpdate(data: {id?: string; questionType: any}) {
    switch (data.questionType) {
      case QuestionType.MULTI_SELECTION:
        this.updateQuestionTpe({
          questionType: data.questionType,
          isScoreEnabled: false,
        });
        this.resetAllScores();
        break;
      case QuestionType.TEXT:
        this.updateQuestion({
          questionType: data.questionType,
          isScoreEnabled: false,
        });
        this.question.isScoreEnabled = false;
        this.deleteAllOptions();
        this.deleteFollowupQuestions(QuestionType.SCALE);
        this.question.questionType = data.questionType;
        break;
      case QuestionType.SCALE:
        this.updateQuestionTpe({
          questionType: data.questionType,
          isScoreEnabled: true,
        });
        this.deleteFollowupQuestions(QuestionType.TEXT);
        break;
      default:
        this.updateQuestionTpe({
          questionType: data.questionType,
          isScoreEnabled: false,
        });
        break;
    }
  }

  deleteFollowupQuestions(questionType: QuestionType) {
    const ids: string | any[] | undefined = [];
    this.questionService.getFollowUpIdsids(
      this.question.followUpQuestions,
      ids,
    );
    if (ids.length && this.question.questionType !== questionType) {
      this.deleteAllFollowUps(ids);
    }
  }

  resetAllScores() {
    this.optionsArray.controls.forEach((control, i) => {
      control?.get(this.questionOptionForm.score)?.setValue(null);
    });
  }
  deleteAllOptions() {
    const ids = this.question.options.map(option => option.id);
    this._subscriptions.push(
      this.questionProxyService
        .deleteOptionBulk(this.question.id, ids)
        .subscribe({
          next: (_: any) => {
            this.question.options = [];
          },
        }),
    );
  }

  get optionsArray(): FormArray {
    return this.modalForm.get('optionsArray') as FormArray; //NOSONAR
  }

  focusInQuestionTitle() {
    this.questionService.saveInProgressCountSubject.next(1);
  }

  focusOutQuestionTitle() {
    const name = this.modalForm?.get('name')?.value;
    this.question.name = name?.trim() || '';
    this._subscriptions.push(
      this.questionProxyService
        .updateQuestion(this.question.id, {
          name: this.question.name,
        })
        .subscribe({
          next: () => this.questionService.saveInProgressCountSubject.next(-1),
          error: () => this.questionService.saveInProgressCountSubject.next(-1),
        }),
    );
    if (this.question.name !== name) {
      this.modalForm?.get('name')?.setValue(this.question.name);
    }
  }

  @ngDebounce(APP_CONSTANTS.QUESTION_UPDATE_DEBOUNCE)
  updateQuestion(data: {
    isScoreEnabled?: boolean;
    questionType?: QuestionType;
    isFollowupEnabled?: boolean;
  }) {
    this._subscriptions.push(
      this.questionProxyService
        .updateQuestion(this.question.id, data)
        .subscribe
        //
        (),
    );
  }

  updateQuestionTpe(data: {
    isScoreEnabled?: boolean;
    questionType: QuestionType;
  }) {
    this._subscriptions.push(
      this.questionProxyService
        .updateQuestion(this.question.id, data)
        .subscribe({
          next: resp => {
            const questionWithOptions = [
              QuestionType.MULTI_SELECTION,
              QuestionType.DROP_DOWN,
              QuestionType.SINGLE_SELECTION,
            ];
            this.question.isScoreEnabled = resp?.isScoreEnabled;
            this.question.options = orderBy(resp.options, 'displayOrder', [
              'asc',
            ]);
            if (
              !(
                questionWithOptions.includes(this.question.questionType) &&
                questionWithOptions.includes(data.questionType)
              )
            ) {
              this.optionsArray.controls.length = 0;
              this.optionsArray.push(this.optionsControl());
            }
            this.question.questionType = data.questionType;
          },
        }),
    );
  }

  questionSelected() {
    if (
      (this.mode === Mode.READONLY && !this.selectQuestionsOnReadOnly) ||
      this.questionService.questionIdOfFocusedQuestion === this.question.id ||
      !this.selectAndFocusQuestion
    ) {
      return;
    }
    this.questionService.questionIdOfFocusedQuestion = this.question.id;
    this.setQuestionPageOnFocus();
    this.openSettingsDrawer();
  }

  openSettingsDrawer() {
    this.questionService.questionFocused.next({
      id: this.question.id,
      question: this.question,
      depth: this.depth,
    });
  }

  setQuestionPageOnFocus() {
    if (!this.question.parentQuestionId) {
      this.questionService.questionSelectedForScroll.next({page: this.order});
    } else {
      this.clickEvent.emit();
    }
  }

  followUpToggle(i: number) {
    if (this.mode === Mode.READONLY) {
      return;
    }
    if (this.question.options[i].followupQuestionId) {
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
            'This will delete the follow up questions(s) attached with this follow up question (if any)',
          confirmationIcon: ConfirmationAction.WARNING,
          yesLabel: 'Confirm',
          noLabel: 'Cancel',
        },
      });
      this._subscriptions.push(
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.questionUtilityService.deleteFollowUpQuestionIdAndQuestion(
              i,
              this.question,
              this._subscriptions,
              this.followUpToggleAndChildrenRemovedCallBack,
            );
          }
        }),
      );
    } else {
      this.question.options[i].showDroppable =
        !this.question.options[i].showDroppable;
      this.question.options = [...this.question.options];
    }
  }

  followUpToggleAndChildrenRemovedCallBack = () => {
    this.recalculateChildrenCount.emit();
  };
  setFollowUpLayout(value: any, option?: Options) {
    let payload = new QuestionPayload({
      questionType: value,
      status: QuestionStatus.ADDED_TO_SURVEY,
      surveyId: this.question.surveyId,
      parentQuestionId: this.question.id,
      rootQuestionId: this.question.rootQuestionId
        ? this.question.rootQuestionId
        : this.question.id,
    });
    this.drop(payload, option);
  }
  dropFollowUp(e: {item: {data: {value: any}}}, option?: Options) {
    let payload = new QuestionPayload({
      questionType: e?.item?.data?.value,
      parentQuestionId: this.question.id,
      rootQuestionId: this.question.rootQuestionId
        ? this.question.rootQuestionId
        : this.question.id,
    });
    this.drop(payload, option);
  }
  drop(payload: QuestionPayload, option?: Options) {
    if (
      this.question.questionType !== QuestionType.TEXT &&
      this.question.questionType !== QuestionType.SCALE &&
      option?.id
    ) {
      payload['optionId'] = option.id;
    }

    if (this.question) {
      this._subscriptions.push(
        this.questionProxyService.createQuestion(payload).subscribe({
          next: question => {
            this.questionService.flatQuestionsMap[question.id] = question;
            const questionWithOptions = question;
            if (
              this.question.questionType !== QuestionType.TEXT &&
              this.question.questionType !== QuestionType.SCALE &&
              option
            ) {
              questionWithOptions.followUpOption = option;
              const index = this.question.options.findIndex(
                opt => opt.id === option.id,
              );
              this.question.options[index].showDroppable = false;
              this.question.options[index].followupQuestionId =
                questionWithOptions.id;
              this.question.options = [...this.question.options];
            }
            questionWithOptions.isExpanded = true;
            this.question.followUpQuestions.push(questionWithOptions);
            this.cdRef.detectChanges();
            this.questionService.questionIdOfFocusedQuestion = question.id;
            this.questionService.questionFocused.next({
              id: question.id,
              question: questionWithOptions,
              depth: this.depth + 1,
            });
            this.setQuestionPageOnFocus();
            this.calculateChildrenCount();
            this.recalculateChildrenCount.emit();
          },
        }),
      );
    }
  }

  duplicateQuestion() {
    this.questionService.duplicateQuestion.next({question: this.question});
  }

  deleteQuestions() {
    if (this.hasCustomDelete) {
      this.deleteEvent.emit({
        question: this.question,
        showDependencyAlert: this.isOtherQuestionHasDependency,
      });
      return;
    }
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '100%',
      maxWidth: '430px',
      panelClass: 'allowSaveDialog',
      position: {
        top: '64px',
      },
      data: {
        dialogMsg: `Are you sure you want to delete this ${
          this.question?.parentQuestionId ? 'follow up question' : 'question'
        } ?`,

        confirmationIcon: ConfirmationAction.DELETE,
        yesLabel: 'Delete',
        noLabel: 'Cancel',
      },
    });
    this._subscriptions.push(
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          const ids = [this.question.id];
          this.questionService.getFollowUpIdsids(
            this.question.followUpQuestions,
            ids,
          );
          this.question.followUpQuestions = [];
          this._subscriptions.push(
            this.questionProxyService.deleteQuestionBulk(ids).subscribe({
              next: (_: any) => {
                if (this.question.parentQuestionId) {
                  // focus root question when focused followup question is deleted
                  this.focusRootQuestionWhenFollowupDelete();
                  this.updateFollowUpQuestionIdForOption();
                  this.questionService.flatQuestionsMap[
                    this.question.parentQuestionId
                  ].options?.forEach(opt => {
                    if (opt.id === this.question.followUpOption?.id) {
                      opt.followupQuestionId = undefined;
                    }
                  });
                } else {
                  this.updateAfterQuestionDelete();
                }
              },
            }),
          );
        }
      }),
    );
  }

  updateAfterQuestionDelete() {
    this.childrenCount = 0;
    this.recalculateChildrenCount.emit();
    this.questionService.deletedQuestion.next({
      question: this.question,
    });
  }

  updateFollowUpQuestionIdForOption() {
    if (
      this.parentQuestionData?.questionType === QuestionType.TEXT ||
      this.parentQuestionData?.questionType === QuestionType.SCALE
    ) {
      this.updateAfterQuestionDelete();
    } else if (this.question?.followUpOption?.id) {
      this.updateFollowUpQuestionId(this.question?.followUpOption?.id);
    } else {
      // do nothing
    }
  }

  focusRootQuestionWhenFollowupDelete() {
    if (this.questionService.questionIdOfFocusedQuestion === this.question.id) {
      this.questionService.questionIdOfFocusedQuestion =
        this.question?.rootQuestionId;
      this.questionService.questionFocused.next({
        id: this.question?.rootQuestionId,
        question:
          this.questionService.flatQuestionsMap[this.question?.rootQuestionId],
        depth: this.depth,
      });
    }
  }

  updateFollowUpQuestionId(id: string) {
    this._subscriptions.push(
      this.questionProxyService
        .updateOption(this.question?.parentQuestionId, id, {})
        .subscribe((_: any) => {
          this.updateAfterQuestionDelete();
        }),
    );
  }

  deleteAllFollowUps(ids: any[]) {
    this.question.followUpQuestions = [];
    this._subscriptions.push(
      this.questionProxyService.deleteQuestionBulk(ids).subscribe(),
    );
  }

  toggleExpansion() {
    this.question.isExpanded = !this.question.isExpanded;
    this.cdRef.detectChanges();
  }

  followUpOptionChange(option: Options | null) {
    const payload = [
      {
        id: option?.id,
        followupQuestionId: this.question.id ? this.question.id : null,
      },
    ];
    if (this.question.followUpOption) {
      payload.push({
        id: this.question.followUpOption?.id,
        followupQuestionId: null,
      });
    }
    this._subscriptions.push(
      this.questionProxyService
        .updateManyOption(this.question?.parentQuestionId, payload)
        .subscribe({
          next: (_: any) => {
            this.questionService.flatQuestionsMap[
              this.question.parentQuestionId
            ].options?.forEach(opt => {
              if (opt.id === this.question.followUpOption?.id) {
                opt.followupQuestionId = undefined;
              } else if (opt.id === option?.id) {
                opt.followupQuestionId = this.question.id;
              } else {
                // do nothing
              }
            });
            this.question.followUpOption = option;
            this.parentQuestionData =
              this.questionService?.flatQuestionsMap?.[
                this.question?.parentQuestionId
              ];
            if (this.parentQuestionData) {
              this.parentQuestionData.options = [
                ...this.parentQuestionData.options,
              ];
            }
          },
        }),
    );
  }

  dropOnQuestion() {
    if (this.showErrorOnAddingQuestionOnOptions) {
      this.toastr.error('You cannot add more questions');
    }
  }

  cancelFollowUp(option: Options) {
    option.showDroppable = false;
    this.question.options = [...this.question.options];
  }

  weightInputFocusOut() {
    const formVal = this.weightageForm.getRawValue();
    if (formVal.value === null) {
      this.weightageValueEvent.emit(0);
      return;
    }
    if (this.weightageForm.valid && formVal.value <= APP_CONSTANTS.HUNDRED) {
      this.weightageValueEvent.emit(formVal.value);
    }
  }

  surveyResponseResult(
    response: {question: Question; surveyAnswer: string | string[]} | undefined,
  ) {
    this.questionResponse = {
      ...this.questionResponse,
      [this.question.id]: response,
    };
    if (response?.surveyAnswer) {
      this.showErrorMsg = false;
    }
    this.surveyResponse.emit(response);
  }
}
