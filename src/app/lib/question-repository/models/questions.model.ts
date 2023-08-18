import {Options} from './options.model';

export class Question {
  id: string;
  createdOn: string;
  createdByName: string;
  createdBy: string;
  questionId: string;
  name: string;
  status: QuestionStatus;
  questionType: QuestionType;
  isMandatory?: boolean;
  isScoreEnabled?: boolean;
  isFollowupEnabled?: boolean;
  validation?: object;
  rootQuestionId: string;
  parentQuestionId: string;
  followUpQuestions: Question[];
  options: Options[];
  followUpOption: Options | null;
  isExpanded: boolean;
  answerSelectedOptionIds: string[];
  answerText: string;
  surveyId: string;

  constructor(data: Partial<Question>) {
    if (data) {
      Object.assign(this, data);
      this.followUpQuestions =
        data?.followUpQuestions && Array.isArray(data?.followUpQuestions)
          ? data?.followUpQuestions
          : [];
      this.options = data?.options?.map(option => new Options(option)) || [];
      this.followUpOption = null;
      this.answerText = data?.answerText ?? '';
    }
  }
}

export enum QuestionStatus {
  DRAFT = 'Draft',
  APPROVED = 'Approved',
  ADDED_TO_SURVEY = 'Added to survey',
}

export enum QuestionStatusColor {
  'Approved' = '#00B900',
  'Draft' = '#C4C4C4',
}

export enum QuestionCreationType {
  SINGLE_QUESTION = 'single_question',
}

export enum QuestionType {
  MULTI_SELECTION = 'Multi Selection',
  SINGLE_SELECTION = 'Single Selection',
  TEXT = 'Text',
  DROP_DOWN = 'Drop Down',
  SCALE = 'Scale',
}

export enum ScoreOrFollowUp {
  SCORE = 'SCORE',
  FOLLOWUP = 'FOLLOWUP',
}

export enum MissingFields {
  QUESTIONBODY = 'QUESTION_BODY',
  FOLLOWUP = 'FOLLOW_UP',
  FOLLOWUPOPTIONS = 'FOLLOWUP_OPTIONS',
  OPTIONS = 'QUESTION_OPTIONS',
  SCALE_EXTREME_VALUE = 'MISSING_EXTREME_VALUES',
  SCLAE_FOLLOWUP_EXTREME_VALUE = 'SCALE_FOLLOW_UP_EXTREME_VALUE',
}

export enum Mode {
  READONLY = 'readonly',
  EDIT = 'edit',
  RESPONSE = 'response',
  RESPONSE_VIEW = 'response_view',
}

export enum ScrollPage {
  UP = 'up',
  DOWN = 'down',
}

export enum QuestionTypeAndSection {
  MULTI_SELECTION = 'Multi Selection',
  SINGLE_SELECTION = 'Single Selection',
  TEXT = 'Text',
  DROP_DOWN = 'Drop Down',
  SCALE = 'Scale',
  SECTION = 'Section',
}
