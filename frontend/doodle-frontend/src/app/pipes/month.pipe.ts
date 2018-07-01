import {Pipe, PipeTransform} from '@angular/core';
import * as moment from 'moment';
@Pipe ({
  name : 'month'
})
export class MonthPipe implements PipeTransform {
  transform(val: number): string {
    return moment.unix(val).format('MMMM');
  }
}
