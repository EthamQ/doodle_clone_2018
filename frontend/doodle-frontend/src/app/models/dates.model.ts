import * as moment from 'moment';
export class DatesModel {
  year: string;
  day: string;
  stopTime: string;
  startTime: string;
  constructor(timeFrom, timeTo) {
    moment.locale('en');
    this.year = this.getYearMonth(timeFrom);
    this.startTime = this.getStartTime(timeFrom);
    this.stopTime = this.getStopTime(timeTo);
    this.day = this.getWeekDay(timeFrom);
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
