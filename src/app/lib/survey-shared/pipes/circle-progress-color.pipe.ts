import {Pipe, PipeTransform} from '@angular/core';

const HUNDRED = 100;
@Pipe({
  name: 'progressColor',
})
export class CircleProgressColorPipe implements PipeTransform {
  transform(totalScore: number) {
    if (totalScore === HUNDRED) {
      return '#00b900'; // green
    } else if (totalScore < HUNDRED) {
      return '#ffae00'; // yellow
    } else if (totalScore > HUNDRED) {
      return '#ec0606'; // Red
    } else {
      return '#00b900'; // yellow
    }
  }
}
