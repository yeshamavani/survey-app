import {
  Options,
  Question,
  QuestionPayload,
} from '../question-repository/models';
import {Observable} from 'rxjs';
import {Where} from '../../core/models/backend-filter';
import {Count} from '../../core/api/models';

export interface IQuestionProxyService {
  createQuestion(payload: Partial<QuestionPayload>): Observable<Question>;
  countQuestion(where?: Where<Question> | string): Observable<Count>;
  findQuestion(where?: Where<Question> | string): Observable<Question[]>;
  findQuestionById(id: string): Observable<Question>;

  updateQuestion(id: string, payload: Partial<Question>): Observable<Question>;
  deleteQuestion(id: string, token?: string): Observable<void>;
  deleteQuestionBulk(ids: string[]): Observable<void>;

  createOption(payload: Options, questionId: string): Observable<Options>;
  findOption(questionId: string, filter: string): Observable<Options[]>;
  updateOption(
    questionId: string,
    id: string,
    payload: Partial<Options>,
  ): Observable<Options>;
  updateManyOption(
    questionId: string,
    payload:
      | {followupQuestionId: null; id: string}[]
      | {id: string | undefined; followupQuestionId: string | null}[],
  ): Observable<void>;
  findOptionById(
    questionId: string,
    id: string,
    where?: Where<Options> | string,
  ): Observable<Options>;
  deleteOption(questionId: string, id: string): Observable<void>;
  deleteOptionBulk(
    questionId: string,
    ids: (string | undefined)[],
  ): Observable<void>;
}
