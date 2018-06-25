import {ChangeDetectionStrategy, Component, Inject, OnInit, TemplateRef} from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import * as moment from 'moment';
import {CreateService} from "../../services/create.service";
import {DatesModel} from "../../models/dates.model";
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarComponent implements OnInit {
  view: string = 'month';
  viewDate: Date = new Date();

  events: CalendarEvent[] = [];
  createService: CreateService;
  constructor(@Inject(CreateService) createService: CreateService){
    this.createService = createService;
    moment.locale('de')

  }

  ngOnInit() {
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    const myTag = date.getDate();
    const myMonat = moment.months(date.getMonth());
    const myWochentag = moment.weekdaysShort(date.getDay());
    const day = new DatesModel({tag: myTag, monat:myMonat, wochentag: myWochentag});
    this.createService.addDay(day);

  }








}
