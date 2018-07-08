import * as moment from 'moment';
export class DatesModel {
  date: string;
  timeFrom: number;
  timeTo: number;
  constructor(timeFrom, timeTo) {
    console.log(timeFrom, timeTo);
    moment.locale('en');
    this.timeFrom = timeFrom;
    this.timeTo = timeTo;
    this.date = moment.unix(timeFrom).format('llll');
  }

}
