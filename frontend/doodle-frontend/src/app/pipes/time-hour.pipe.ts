import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
@Pipe({
  name: 'timeHour'
})
export class TimeHourPipe implements PipeTransform {

  transform(val: number): string {
    return moment.unix(val).format('LT');
  }
}
