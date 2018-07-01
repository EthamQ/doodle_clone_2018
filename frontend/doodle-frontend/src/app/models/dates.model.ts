import * as moment from 'moment';
export class DatesModel {
  date: string;
  timeFrom: number;
  timeTo: number;
  constructor(timeFrom, timeTo) {
    moment.locale('en');
    this.timeFrom = timeFrom;
    this.timeTo = timeTo;
    this.date = moment.unix(timeFrom).format('llll');
  }
  getStartTime(timestamp) {
    return moment.unix(timestamp).format('LT');
  }
  getStopTime(timestamp) {
    return moment.unix(timestamp).format('LT');
  }
  getWeekDay(timestamp) {
    return moment.unix(timestamp).format('dd');
  }
  getYearMonth(timestamp) {
    return moment.unix(timestamp).format('ll');
  }
}
