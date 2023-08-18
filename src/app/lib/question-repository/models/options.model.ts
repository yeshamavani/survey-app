export class Options {
  id?: string;
  name?: string;
  displayOrder: number;
  score?: number;
  questionId: string;
  itemId?: string;
  followupQuestionId?: string | null;
  showDroppable?: boolean;
  constructor(data: Partial<Options>) {
    if (data) {
      Object.assign(this, data);
      this.showDroppable = false;
    }
  }
}
