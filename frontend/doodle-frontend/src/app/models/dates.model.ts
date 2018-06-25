export class DatesModel{
  tag: number;
  monat: string;
  wochentag: string;
  constructor(data: any = {}) {
    this.tag = data.tag;
    this.monat = data.monat;
    this.wochentag = data.wochentag;
  }
}
