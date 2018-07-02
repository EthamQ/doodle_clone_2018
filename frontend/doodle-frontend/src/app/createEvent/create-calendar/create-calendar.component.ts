import {Component, EventEmitter, Inject, OnInit} from '@angular/core';
import {CreateService} from '../../services/create.service';
import * as moment from 'moment';
import {DateButton, DlDateTimePickerChange} from 'angular-bootstrap-datetimepicker';
import {TimeselectionModel} from '../../models/timeselection.model';
import {isUndefined} from 'util';


@Component({
  selector: 'app-create-calendar',
  templateUrl: './create-calendar.component.html',
  styleUrls: ['./create-calendar.component.css']
})
export class CreateCalendarComponent implements OnInit {
  createService: CreateService;
  constructor(@Inject(CreateService) createservice: CreateService) {
    this.createService = createservice;
  }
  ngOnInit() {}
  handleEvent(event: any) {
    const newDate = new TimeselectionModel();
    newDate.setTimeFrom(moment(event.value).unix());
    newDate.setTimeTo(moment(event.value).unix());
    console.log(newDate);
    this.createService.timeSelection.push(newDate);
  }

  setCalendar() {
    this.createService.setCalendar();
  }
}
