import {ChangeDetectionStrategy, Component, Inject, OnInit, TemplateRef} from '@angular/core';
import {CalendarEvent, CalendarMonthViewDay} from 'angular-calendar';
import * as moment from 'moment';
import {CreateService} from "../../services/create.service";
import {DatesModel} from "../../models/dates.model";
import { DayViewHour } from 'calendar-utils';
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarComponent implements OnInit {
  view: string = 'month';
  viewDate: Date = new Date();

  selectedMonthViewDay: CalendarMonthViewDay;

  selectedDayViewDate: Date;

  dayView: DayViewHour[];

  events: CalendarEvent[] = [];
  createService: CreateService;
  constructor(@Inject(CreateService) createService: CreateService){
    this.createService = createService;
    moment.locale('de')

  }

  ngOnInit() {
  }

  dayClicked(day: CalendarMonthViewDay): void {
    if (this.selectedMonthViewDay) {
      delete this.selectedMonthViewDay.cssClass;
    }
    day.cssClass = 'cal-day-selected';
    this.selectedMonthViewDay = day;
  }

  beforeMonthViewRender({ body }: { body: CalendarMonthViewDay[] }): void {
    body.forEach(day => {
      if (
        this.selectedMonthViewDay &&
        day.date.getTime() === this.selectedMonthViewDay.date.getTime()
      ) {
        day.cssClass = 'cal-day-selected';
        this.selectedMonthViewDay = day;
      }
    });
  }

  hourSegmentClicked(date: Date) {
    this.selectedDayViewDate = date;
    this.addSelectedDayViewClass();
  }

  beforeDayViewRender(dayView: DayViewHour[]) {
    this.dayView = dayView;
    this.addSelectedDayViewClass();
  }

  private addSelectedDayViewClass() {
    this.dayView.forEach(hourSegment => {
      hourSegment.segments.forEach(segment => {
        delete segment.cssClass;
        if (
          this.selectedDayViewDate &&
          segment.date.getTime() === this.selectedDayViewDate.getTime()
        ) {
          segment.cssClass = 'cal-day-selected';
        }
      });
    });
  }







}
