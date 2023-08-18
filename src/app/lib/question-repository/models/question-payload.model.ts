import { Question } from './questions.model';

export class QuestionPayload extends Question {
  optionId: string;
}
