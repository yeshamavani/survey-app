import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {
  MissingFields,
  Question,
  QuestionStatus,
  QuestionType,
  ScoreOrFollowUp,
} from '../../question-repository/models';

@Injectable()
export class QuestionService {
  scoreOrFollowUpChange: Subject<{
    id: string;
    change: ScoreOrFollowUp;
    value: boolean;
  }> = new Subject();
  updatedQuestionType: Subject<{
    id: string;
    questionType: QuestionType;
  }> = new Subject();
  deletedQuestion: Subject<{
    question: Question;
  }> = new Subject();
  duplicateQuestion: Subject<{
    question: Question;
  }> = new Subject();
  questionFocused: Subject<{
    id: string;
    question: Question | null;
    depth: number;
  }> = new Subject();
  currentPageNumber: Subject<{
    pageNumber: number;
    handleScrollFromNavigator: boolean;
  }> = new Subject();
  displayOrderChange = new Subject();
  flatQuestionsMap: { [key: string]: Question } = {};
  questionIdOfFocusedQuestion = '';
  questionSelectedForScroll: Subject<{ page: number }> = new Subject();
  focusQuestionOnPageChange: Subject<{ page: number }> = new Subject();
  surveyResponseData: {
    [key: string]: {
      questionId: string;
      score?: number;
      answer: { optionId?: string; optionIds?: string[]; text?: string };
    };
  };
  resetSurvey: Subject<void> = new Subject();
  showMandatoryError: Subject<string> = new Subject();
  followupQuestionsIdsForSort: string | any[] = [];
  saveInProgressCountSubject: Subject<number> = new Subject<number>();
  questionDrop: Subject<void> = new Subject();
  updatedOptions: Subject<{
    questionId: string;
  }> = new Subject();

  /**
   * For response capturing, there is pagination to show 25 questions at a time inside a section.
   * So this variable will be used to trigger an event to add all questions available inside a
   * section So that mandatory questions can be highlighted & scrolled upn on next button click.
   */
  addHiddenSurveyQuestions = new Subject();
  constructor() {
    //intentional
  }
  // sonarignore:start
  transformQuestionTree(questions: Question[]) {
    const map: { [key: string]: number } = {};
    const roots = [];
    let node;
    for (let i = 0; i < questions?.length; i += 1) {
      map[questions[i].id] = i; // initialize the map
      questions[i].followUpQuestions = []; // initialize the children
    }

    for (let i = 0; i < questions?.length; i += 1) {
      node = questions[i];
      if (node.parentQuestionId) {
        // if you have dangling branches check that map[node.parentQuestionId] exists
        questions[map[node.parentQuestionId]].followUpQuestions.push(node);
      } else {
        roots.push(node);
      }
    }
    this.setFollowUpQuestionsAsPerOptionsOrder(roots);
    return roots;
  }
  // sonarignore:end

  setFollowUpQuestionsAsPerOptionsOrder(questions: Question[]) {
    questions.forEach((question) => {
      this.followupQuestionsIdsForSort =
        question.options.map((option) => option.followupQuestionId) ?? [];
      question?.followUpQuestions?.sort(this.customOrderBy.bind(this));
      if (question?.followUpQuestions?.length)
        this.setFollowUpQuestionsAsPerOptionsOrder(question.followUpQuestions);
    });
  }

  customOrderBy(a: { id: any }, b: { id: any }) {
    return (
      this.followupQuestionsIdsForSort.indexOf(a.id) -
      this.followupQuestionsIdsForSort.indexOf(b.id)
    );
  }

  setOptionDataInQuestionObject(questions: Question[]) {
    questions?.forEach((question) => {
      question?.options?.forEach((option) => {
        if (option?.followupQuestionId) {
          const index = questions.findIndex(
            (ques) => ques.id === option?.followupQuestionId
          );
          if (index > -1) questions[index].followUpOption = option;
        }
      });
    });
  }

  getQuestionType() {
    return [
      {
        displayValue: 'Multi Selection',
        value: QuestionType.MULTI_SELECTION,
        src: 'assets/images/clm-images/survey/checkbox-Outline.svg',
      },
      {
        displayValue: 'Single Selection',
        value: QuestionType.SINGLE_SELECTION,
        src: 'assets/images/clm-images/survey/radio-Outline.svg',
      },
      {
        displayValue: 'Text',
        value: QuestionType.TEXT,
        src: 'assets/images/clm-images/survey/short-text-Outline.svg',
      },
      {
        displayValue: 'Drop Down',
        value: QuestionType.DROP_DOWN,
        src: 'assets/images/clm-images/survey/drop-down.svg',
      },
      {
        displayValue: 'Scale',
        value: QuestionType.SCALE,
        src: 'assets/images/clm-images/survey/scale.svg',
      },
    ];
  }

  getFollowUpIdsids(followUpQuestions: Question[], ids: string[] = []) {
    followUpQuestions?.forEach((followUp) => {
      this.getFollowUpIdsids(followUp?.followUpQuestions, ids);
      ids.push(followUp.id);
    });
  }

  getStatusCodes(lblDraft: any, lblApproved: any) {
    return [
      {
        id: 0,
        text: lblDraft,
        value: QuestionStatus.DRAFT,
      },

      {
        id: 1,
        text: lblApproved,
        value: QuestionStatus.APPROVED,
      },
    ];
  }

  getQuestionTypes(
    lblDropDown: any,
    lblMultiSelection: any,
    lblScale: any,
    lblSingleQuestion: any,
    lblText: any
  ) {
    return [
      {
        id: 0,
        text: lblDropDown,
        value: QuestionType.DROP_DOWN,
      },
      {
        id: 1,
        text: lblMultiSelection,
        value: QuestionType.MULTI_SELECTION,
      },
      {
        id: 2,
        text: lblScale,
        value: QuestionType.SCALE,
      },
      {
        id: 3,
        text: lblSingleQuestion,
        value: QuestionType.SINGLE_SELECTION,
      },
      {
        id: 4,
        text: lblText,
        value: QuestionType.TEXT,
      },
    ];
  }

  mapFollowUpQuestionsOption(question: Question) {
    this.flatQuestionsMap[question.id] = question;
    question?.options?.forEach((opt) => {
      if (opt?.followupQuestionId && question.followUpQuestions?.length) {
        let index = question.followUpQuestions.findIndex(
          (ques) => ques.id === opt.followupQuestionId
        );
        if (index > -1) {
          question.followUpQuestions[index].followUpOption = opt;
        }
      }
    });
    if (question.followUpQuestions?.length) {
      question.followUpQuestions?.forEach((ques) => {
        this.mapFollowUpQuestionsOption(ques);
      });
    }
  }
  checkIfDataMissingInFollowUps(question: Question) {
    const missingData = [];
    if (!question.name) {
      missingData.push(MissingFields.FOLLOWUP);
    }
    const optionsName = this.getOptionsWhoseNameIsMissing(question);
    if (optionsName?.length) {
      missingData.push(
        question?.questionType === QuestionType.SCALE
          ? MissingFields.SCLAE_FOLLOWUP_EXTREME_VALUE
          : MissingFields.FOLLOWUPOPTIONS
      );
    }
    return missingData;
  }

  checkIfDataMissingInRootQuestion(question: Question) {
    const missingData = [];
    if (!question?.name) {
      missingData.push(MissingFields.QUESTIONBODY);
    }
    const optionsName = this.getOptionsWhoseNameIsMissing(question);
    if (optionsName?.length) {
      missingData.push(
        question?.questionType === QuestionType.SCALE
          ? MissingFields.SCALE_EXTREME_VALUE
          : MissingFields.OPTIONS
      );
    }
    return missingData;
  }
  getOptionsWhoseNameIsMissing(question: {
    options: any[];
    questionType: QuestionType;
  }) {
    return question?.options?.filter((option: { name: string }, i: number) => {
      if (question?.questionType === QuestionType.SCALE) {
        // For scale questions, check only first & last options Name property for extreme values
        if (i === 0 || i === question.options.length - 1) {
          return !option?.name?.trim();
        }
        return false;
      }
      return !option?.name?.trim();
    });
  }
}
