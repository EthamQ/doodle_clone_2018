import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'day'
})
export class DayPipe implements PipeTransform {
  transform(val: number): string {
    return moment.unix(val).format('DD');
  }
}
