import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'targetStringLength',
})
export class TargetStringLength implements PipeTransform {
  transform(value: { toString: () => string }, length: number) {
    return value?.toString().padStart(length, '0');
  }
}
