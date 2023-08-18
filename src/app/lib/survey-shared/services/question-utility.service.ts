import {Inject, Injectable} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {
  ConfirmDialogComponent,
  ConfirmationAction,
} from '../../../shared/components';
import {APP_CONSTANTS} from '../../../shared/constants';
import {Mode, Question, Options} from '../../question-repository/models';
import {QuestionService} from './question.service';
import {Subscription} from 'rxjs';
import {IQuestionProxyService} from '../types';

@Injectable()
export class QuestionUtilityService {
  constructor(
    private readonly dialog: MatDialog,
    @Inject('questionProxyService')
    private questionProxyService: IQuestionProxyService,

    private readonly questionService: QuestionService,
  ) {}
  followUpToggle(
    i: number,
    mode: Mode,
    question: Question,
    _subscriptions: Subscription[],
    followUpToggleAndChildrenRemovedCallBack: any,
  ) {
    if (mode === Mode.READONLY) {
      return;
    }
    if (question.options[i].followupQuestionId) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '100%',
        maxWidth: '430px',
        panelClass: 'allowSaveDialog',
        position: {
          top: '64px',
        },
        data: {
          dialogMsg: 'LBL_CONFIRM_MSG_FOR_DISABLE_FOLLOWUP',
          footerNote: 'LBL_DELETE_FOLLOW_UP_QUESTION',
          confirmationIcon: ConfirmationAction.WARNING,
          yesLabel: 'LBL_CONFIRM',
          noLabel: 'LBL_CANCEL',
        },
      });
      _subscriptions.push(
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.deleteFollowUpQuestionIdAndQuestion(
              i,
              question,
              _subscriptions,
              followUpToggleAndChildrenRemovedCallBack,
            );
          }
        }),
      );
    } else {
      question.options[i].showDroppable = !question.options[i].showDroppable;
      question.options = [...question.options];
    }
  }
  deleteFollowUpQuestionIdAndQuestion(
    i: number,
    question: Question,
    _subscriptions: Subscription[],
    followUpToggleAndChildrenRemovedCallBack: any,
  ) {
    _subscriptions.push(
      this.questionProxyService
        .updateOption(question.id, question.options[i].id ?? '', {
          followupQuestionId: null,
        })
        .subscribe(_ => {
          this.deleteQuestionsForDeletedOption(
            question.options[i],
            question,
            _subscriptions,
            followUpToggleAndChildrenRemovedCallBack,
          );
          question.options[i].followupQuestionId = '';
          this.questionService.flatQuestionsMap[question.id].options[
            i
          ].followupQuestionId = '';
          question.options[i].showDroppable = false;
        }),
    );
  }

  deleteQuestionsForDeletedOption(
    deletedOption: Options,
    question: Question,
    _subscriptions: Subscription[],
    followUpToggleAndChildrenRemovedCallBack: () => void,
  ) {
    if (deletedOption.followupQuestionId) {
      const ids = [deletedOption.followupQuestionId];
      const questions =
        question.followUpQuestions?.find(
          ques => ques.id === deletedOption?.followupQuestionId,
        ) ?? null;
      this.questionService.getFollowUpIdsids(
        questions?.followUpQuestions ?? [],
        ids,
      );
      if (questions) {
        _subscriptions.push(
          this.questionProxyService.deleteQuestionBulk(ids).subscribe(_ => {
            this.questionService.deletedQuestion.next({
              question: questions,
            });
            followUpToggleAndChildrenRemovedCallBack();
          }),
        );
      }
    }
  }

  setFollowupQuestionIdAsNullWhenFollowupDisable(
    question: Question,
    _subscriptions: Subscription[],
    questionIds: string | any[],
    callback: (arg0: any) => void,
  ) {
    if (questionIds.length) {
      const ids: string[] = [];
      this.getFollowUpOptionIds(question.followUpQuestions, ids);
      const payload: string | {followupQuestionId: null; id: any}[] = [];
      ids?.forEach(id =>
        payload.push({
          followupQuestionId: null,
          id,
        }),
      );
      _subscriptions.push(
        this.questionProxyService
          .updateManyOption(question.id, payload)
          .subscribe(() => callback(questionIds)),
      );
    }
  }

  getFollowUpOptionIds(followUpQuestions: Question[], ids: string[] = []) {
    followUpQuestions?.forEach(followUp => {
      if (followUp?.followUpOption?.id) ids.push(followUp?.followUpOption?.id);
    });
  }

  focusQuestionAfterFollowUpDelete(ques: {id: string}) {
    if (this.questionService.questionIdOfFocusedQuestion === ques.id) return;
    setTimeout(() => {
      this.questionService.questionIdOfFocusedQuestion = ques.id;
      this.questionService.questionFocused.next({
        id: ques.id,
        question: new Question(ques),
        depth: 0,
      });
    }, APP_CONSTANTS.TEN);
  }
}
