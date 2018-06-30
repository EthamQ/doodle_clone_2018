export class DatesModel{
  date: number;
  timeFrom: number;
  timeTo: number;
  constructor(uDate: number, uTimeFrom: number, uTimeTo: number) {
    this.date = uDate;
    this.timeFrom = uTimeFrom;
    this.timeTo = uTimeTo;
  }
  getYear(){
    const year = 2018;
    return year;
  }
  getMonath(){
    const monat = 'Januar';
    return monat;
  }
  getWeekDay(){
    const wochentag = 'Mi';
    return wochentag;
  }
  getDay(){
    const tag = 12;
    return tag;
  }
}
