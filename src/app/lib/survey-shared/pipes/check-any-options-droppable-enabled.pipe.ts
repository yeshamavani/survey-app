import {Pipe, PipeTransform} from '@angular/core';
import {Options} from '../../question-repository/models';

@Pipe({
  name: 'checkAnyOptionsHasDroppable',
})
export class CheckAnyOptionsHasDroppable implements PipeTransform {
  transform(options: Options[]) {
    return options?.some(option => option.showDroppable) || false;
  }
}
