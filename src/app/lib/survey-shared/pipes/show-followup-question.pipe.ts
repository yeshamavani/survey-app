import { Pipe, PipeTransform } from '@angular/core';
import { Question, QuestionType } from '../../question-repository/models';
import { QuestionService } from '../services/question.service';

@Pipe({
  name: 'showFollowup',
})
export class ShowFollowupQuestion implements PipeTransform {
  constructor(private readonly questionService: QuestionService) {}
  transform(question: Question, followupQuestion: Question, _res: any) {
    if (!followupQuestion || !this.questionService.surveyResponseData) {
      return false;
    }
    let showFollowupQuestion = false;
    const quesResponse = this.questionService.surveyResponseData[question.id];
    const followUpOptionId = followupQuestion.followUpOption?.id;
    switch (question.questionType) {
      case QuestionType.TEXT:
        showFollowupQuestion = !!quesResponse?.answer.text;
        break;
      case QuestionType.SINGLE_SELECTION:
      case QuestionType.DROP_DOWN:
        showFollowupQuestion =
          followUpOptionId === quesResponse?.answer.optionId;
        break;
      case QuestionType.SCALE:
        showFollowupQuestion = !!quesResponse?.answer.optionId;
        break;
      case QuestionType.MULTI_SELECTION:
        if (quesResponse?.answer?.optionIds && followUpOptionId)
          showFollowupQuestion =
            quesResponse?.answer?.optionIds.includes(followUpOptionId);
        break;
    }
    if (!showFollowupQuestion) {
      if (this.questionService.surveyResponseData[followupQuestion.id]) {
        // followup is not to be shown & there answer is saved, then delete there answer from service.
        delete this.questionService.surveyResponseData[followupQuestion.id];
      }
    }
    return showFollowupQuestion;
  }
}
