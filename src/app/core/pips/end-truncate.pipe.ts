import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'endTruncate',
  standalone: false 

})
export class EndTruncatePipe implements PipeTransform {

  transform(value: string, keep: number = 3): string {
    if (!value) return '';
    if (value.length <= keep) return value;
    return '...' + value.slice(0, keep);
   }

}
