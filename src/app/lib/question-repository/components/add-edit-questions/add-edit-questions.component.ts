import {ChangeDetectorRef, Component, Inject, ViewChild} from '@angular/core';
import {ThemePalette} from '@angular/material/core';
import {MatDrawer} from '@angular/material/sidenav';
import {ActivatedRoute, Router} from '@angular/router';
import {
  Mode,
  Question,
  QuestionCreationType,
  QuestionStatus,
  QuestionType,
} from '../../models';
import {cloneDeep} from 'lodash';
import {ToastrService} from 'ngx-toastr';
import {QuestionPayload} from '../../models/question-payload.model';
import {IQuestionProxyService} from '../../../survey-shared/types';
import {ComponentBase} from '../../../../core';
import {QuestionService} from '../../../survey-shared/services/question.service';
import {APP_CONSTANTS, RoutingLink} from '../../../../shared';
@Component({
  selector: 'app-add-edit-questions',
  templateUrl: './add-edit-questions.component.html',
  styleUrls: ['./add-edit-questions.component.scss'],
})
export class AddEditQuestionsComponent extends ComponentBase {
  @ViewChild('drawer', {static: false}) public drawer: MatDrawer;
  color: ThemePalette = 'primary';
  checked = false;
  disabled = false;
  questions: Question[] = [];
  questionCreationType: QuestionCreationType;
  questionCreationEnum = QuestionCreationType;
  questionLayoutType: {
    displayValue: string;
    value: QuestionType;
    src: string;
  }[];
  listOfFollowUpQuesIdToBeDeleted = [];
  readonly rootQuestionsLimit = APP_CONSTANTS.ROOT_QUESTIONS_LIMIT;
  depth = 0;
  readonly mode = Mode;
  buttonConfigurations = {};
  scrollId = APP_CONSTANTS.QUESTION_SCROLL_ID;
  submitButtonLabel: string;
  lblAddOneQuestion: string;
  closeButtonLabel: string;
  lblSaveQuestionAsDraft: string;
  questionCount: number;
  order: number;
  isQuestionLoading = false;
  errorsArray: any[] = [];
  questionMissingFieldsError: string[] = [];
  saveInProgressCount = 0;
  haveToSubmit = false;

  constructor(
    @Inject('questionProxyService')
    private questionProxyService: IQuestionProxyService,
    protected readonly route: ActivatedRoute,
    private readonly questionService: QuestionService,
    private readonly toastr: ToastrService,
    private readonly router: Router,
    private readonly cdRef: ChangeDetectorRef,
  ) {
    super();
    this.questionLayoutType = this.questionService.getQuestionType();
  }

  ngOnInit(): void {
    this.order = this.route.snapshot?.queryParams?.['order'];

    this.setPaginationDataAndGetQuestions();
    this._subscriptions.push(
      this.questionService.deletedQuestion.subscribe(data => {
        this.deleteQuestion(data.question);
      }),
      this.questionService.questionFocused.subscribe(data => {
        if (data.id) this.openDrawer();
      }),
      this.questionService.saveInProgressCountSubject.subscribe(count => {
        this.saveInProgressCount += count;
        if (this.haveToSubmit) {
          this.submit();
          this.haveToSubmit = false;
        }
      }),
    );
  }

  setPaginationDataAndGetQuestions() {
    this.questionCreationType = QuestionCreationType.SINGLE_QUESTION;
    this.lblAddOneQuestion = 'Add Single Question';
    if (this.route.snapshot.params['id']) {
      this.getQuestionById();
    } else {
      // do nothing
    }
  }

  getQuestionById() {
    this.isQuestionLoading = true;
    this._subscriptions.push(
      this.questionProxyService
        .findQuestion(this.route.snapshot.params['id'])
        .subscribe({
          next: questions => {
            const _questions = cloneDeep(questions);
            this.questions = [];
            this.questionService.setOptionDataInQuestionObject(questions);
            this.questions =
              this.questionService.transformQuestionTree(questions);
            _questions?.forEach((question: Question, index: number) => {
              this.questionService.flatQuestionsMap[question.id] =
                questions[index];
            });
            this.isQuestionLoading = false;
            this.setDataForEditMode();
          },
          error: () => (this.isQuestionLoading = false),
        }),
    );
  }

  setDataForEditMode() {
    if (this.questions.length) {
      this.questions[0].isExpanded = true;
      this.closeDrawer();
      this.openDrawer();
    }
  }

  drop(e: any) {
    alert(e);
    this.addNewQuestion(e?.item?.data?.value);
  }

  addNewQuestion(questionType: QuestionType) {
    const payload = new QuestionPayload({
      questionType: questionType,
    });

    this._subscriptions.push(
      this.questionProxyService.createQuestion(payload).subscribe({
        next: question => {
          this.questionService.flatQuestionsMap[question.id] = question;
          this.questions.push(question);
          this.questionService.questionIdOfFocusedQuestion = question.id;
          this.questionService.questionFocused.next({
            id: question.id,
            question,
            depth: this.depth,
          });
          this.drawer.close();
          this.drawer.open();
        },
      }),
    );
  }

  closeDrawer() {
    this.drawer.close();
  }

  openDrawer() {
    this.drawer.open();
  }

  prune(questions: Question[], id: string) {
    for (let i = 0; i < questions.length; ++i) {
      let question = questions[i];
      if (question.id === id) {
        questions.splice(i, 1);
        return i;
      }
      if (question?.followUpQuestions?.length) {
        this.prune(question?.followUpQuestions, id);
      }
    }
    return -1;
  }

  deleteQuestion(question: Question) {
    const deletedQuestionIndex = this.prune(this.questions, question.id);
    if (!question.parentQuestionId) {
      if (question.id === this.questionService.questionIdOfFocusedQuestion) {
        if (deletedQuestionIndex)
          this.changeFocusedQuestionOnDeletion(deletedQuestionIndex);
      } else {
        let focusedQuestion;
        let focusedQuestionIndex;
        this.questions.forEach((ques, i) => {
          if (ques.id === this.questionService.questionIdOfFocusedQuestion) {
            focusedQuestion = new Question(ques);
            focusedQuestionIndex = i + 1;
          }
        });
        if (focusedQuestion && focusedQuestionIndex)
          this.focusQuestion(focusedQuestion, focusedQuestionIndex);
      }
    }
    !this.questions.length && this.closeDrawer();
  }

  close() {
    if (this.questions.length) {
      this.toastr.success('Question Saved As Draft');
    }
    this.router.navigate([RoutingLink.ListQuestion]);
  }

  getMissingDataInQuestions(questions: Question[]) {
    for (let [i, question] of questions.entries()) {
      const missingFields: string[] = this.validate(question);
      if (missingFields?.length) {
        const data = {
          missingFields: missingFields,
          order: i + 1,
          id: question.rootQuestionId ?? question.id,
          followUpOption: question?.followUpOption?.name ?? '',
        };
        this.errorsArray.push(data);
      }
      if (question?.followUpQuestions?.length) {
        this.getMissingDataInQuestions(question?.followUpQuestions);
      }
    }
  }

  validate(question: Question) {
    if (question.parentQuestionId) {
      return this.questionService.checkIfDataMissingInFollowUps(question);
    }
    return this.questionService.checkIfDataMissingInRootQuestion(question);
  }

  processSubmitQuestions() {
    {
      const status = QuestionStatus.APPROVED;
      this.showMissingFieldsError();
      if (this.questionMissingFieldsError?.length) {
        this.toastr.error('Missing Question Information');
        return;
      }
      this._subscriptions.push(
        this.questionProxyService
          .updateQuestion(this.questions[0].id, {
            status: status,
          })
          .subscribe(_ => {
            const msg = 'Question Approved Successfully';
            this.toastr.success(msg);
            const redirectPath = RoutingLink.ListQuestion;
            this.router.navigate([redirectPath]);
          }),
      );
    }
  }

  submit() {
    if (this.saveInProgressCount === 0) {
      this.processSubmitQuestions();
    } else {
      this.haveToSubmit = true;
    }
  }
  showMissingFieldsError() {
    this.errorsArray = [];
    this.questionMissingFieldsError = [];
    this.getMissingDataInQuestions(this.questions);
    this.errorsArray.forEach(field => {
      const missingFields = field.missingFields;
      const order = this.questions.findIndex(ele => ele.id === field.id);
      if (missingFields?.length) {
        let missingtext = missingFields
          .map((field: string[]) => field)
          .join(', ');

        let errorString = `Missing ${missingtext}`;

        errorString = this.questionMissingFieldsError[order]
          ? `${this.questionMissingFieldsError[order]}, ${errorString}`
          : errorString;
        this.questionMissingFieldsError[order] = errorString;
        this.cdRef.detectChanges();
      }
    });
  }

  changeFocusedQuestionOnDeletion(deletedQuestionIndex: number) {
    if (this.questions[deletedQuestionIndex - 1]) {
      this.focusQuestion(
        this.questions[deletedQuestionIndex - 1],
        deletedQuestionIndex,
      );
    } else if (this.questions[deletedQuestionIndex]) {
      this.focusQuestion(
        this.questions[deletedQuestionIndex],
        deletedQuestionIndex + 1,
      );
    } else {
      this.closeDrawer();
    }
  }

  focusQuestion(ques: Question, pageNumber: number) {
    setTimeout(() => {
      this.questionService.questionIdOfFocusedQuestion = ques.id;
      this.questionService.questionSelectedForScroll.next({page: pageNumber});
      this.questionService.questionFocused.next({
        id: ques.id,
        question: ques,
        depth: 0,
      });
    }, APP_CONSTANTS.TEN);
  }
}
