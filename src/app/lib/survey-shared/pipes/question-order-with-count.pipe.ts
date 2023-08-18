import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'orderWithCount',
})
export class QuestionOrderWithCount implements PipeTransform {
  transform(lblString: string, order: number, totalCount: number) {
    return lblString
      .replace('{order}', '' + order)
      .replace('{totalCount}', '' + totalCount);
  }
}
