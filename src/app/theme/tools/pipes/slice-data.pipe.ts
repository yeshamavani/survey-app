import {Pipe, PipeTransform} from '@angular/core';
@Pipe({
  name: 'sliceData',
  pure: true,
})
export class SliceDataPipe implements PipeTransform {
  transform(data: [], startIndex: number, endIndex: number) {
    return data && data?.length ? data.slice(startIndex, endIndex) : data;
  }
}
