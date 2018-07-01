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
  getYear() {
    return moment.unix(this.timeFrom).format('YYYY');
  }
  getDay() {
    return moment.unix(this.timeFrom).format('DD');
  }
  getWeekDay() {
    return moment.unix(this.timeFrom).format('dd');
  }
  getStopHour() {
    return moment.unix(this.timeTo).format('LT');
  }
  getStartHour() {
    return moment.unix(this.timeFrom).format('LT');
  }
  getMonth() {
    return moment.unix(this.timeFrom).format('mm');
  }
}
