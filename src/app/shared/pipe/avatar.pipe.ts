import {Pipe, PipeTransform} from '@angular/core';

const MAX_INITIALS = 2;
@Pipe({
  name: 'avatar',
})
export class AvatarPipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): string {
    if (value) {
      let avatar = '';
      const strArr = value.split(/(\s+)/).filter(e => e.trim().length > 0);
      for (let index = 0; index < strArr.length && MAX_INITIALS; index++) {
        avatar = avatar + strArr[index].charAt(0).toUpperCase();
      }
      return avatar;
    }
    return value;
  }
}
