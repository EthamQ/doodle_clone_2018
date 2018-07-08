import * as moment from 'moment';
import {DatesModel} from './dates.model';
export class TimeselectionModel {
  day: string;
  weekDay: string;
  month: string;
  year: string;
  startHour: number;
  stopHour: number;
  startMinute: number;
  stopMinute: number;
  startAMPM: string;
  stopAMPM: string;
  timeFrom: number;
  timeTo: number;
  constructor() {
    this.timeFrom = moment().unix();
    this.timeTo = moment().unix();
  }
  setTimeFrom(time) {
    this.day = moment.unix(time).format('DD');
    this.weekDay = moment.unix(time).format('dd');
    this.month = moment.unix(time).format('MMM');
    this.startHour = parseFloat(moment.unix(time).format('hh'));
    this.startMinute = parseFloat(moment.unix(time).format('mm'));
    this.year = moment.unix(time).format('YYYY');
    this.startAMPM = 'AM';
    this.timeFrom = time;
  }
  setTimeTo(time) {
    this.timeTo = time;
    this.stopHour = parseFloat(moment.unix(time).format('hh'));
    this.stopMinute = parseFloat(moment.unix(time).format('mm'));
    this.stopAMPM = 'AM';
  }
  getDate() {
    return moment.unix(this.timeFrom).format('ll');
  }
  addStartHour() {
    this.startHour = Math.max(1, Math.abs((this.startHour + 1) % 13));
  }
  substractStartHour() {
    if ((this.startHour - 1) === 0) {
      this.startHour = 12;
    } else {
    this.startHour = Math.max(1, Math.abs((this.startHour - 1) % 13));
    }
  }
  addStartMinute() {
    this.startMinute = Math.max(0, Math.abs((this.startMinute + 15) % 60));
  }
  getStartMinute() {
    return this.startMinute > 9 ? '' + this.startMinute : '0' + this.startMinute;
  }
  substractStartMinute() {
    this.startMinute = Math.max(0, Math.abs((this.startMinute - 15) % 60));
  }
  changeStopAM() {
    if (this.stopAMPM === 'AM') {
      this.stopAMPM = 'PM';
    } else {
      this.stopAMPM = 'AM';
    }
  }
  changeStartAM() {
    if (this.startAMPM === 'AM') {
      this.startAMPM = 'PM';
    } else {
      this.startAMPM = 'AM';
    }
  }
  addStopHour() {
    this.stopHour = Math.max(1, Math.abs((this.stopHour + 1) % 13));  }
  substractStopHour() {
    if ((this.stopHour - 1) === 0) {
      this.stopHour = 12;
    } else {
      this.stopHour = Math.max(1, Math.abs((this.stopHour - 1) % 13));
    }
  }
  addStopMinute() {
    this.stopMinute = Math.max(0, Math.abs((this.stopMinute + 15) % 60));
  }
  substractStopMinute() {
    this.stopMinute = Math.max(0, Math.abs((this.stopMinute - 15) % 60));  }
  getStopMinute() {
    return this.stopMinute > 9 ? '' + this.stopMinute : '0' + this.stopMinute;
  }

  parseToTimeStamp() {
    const date = this.day + '-' + this.month + '-' + this.year;
    const startTime = this.startHour.toString() + ':' + this.getStartMinute() + ' ' + this.startAMPM;
    const stopTime = this.stopHour.toString() + ':' + this.getStopMinute() + ' ' + this.stopAMPM;
    this.timeFrom = moment(date + ' ' + startTime).unix();
    this.timeTo = moment(date + ' ' + stopTime).unix();
    return new DatesModel(this.timeFrom, this.timeTo);
  }
}
