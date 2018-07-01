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
  timeSelection: Array<TimeselectionModel> = [];
  constructor() {}
  ngOnInit() {}
  handleEvent(event: any) {
    const newDate = new TimeselectionModel();
    newDate.setTimeFrom(moment(event.value).unix());
    newDate.setTimeTo(moment(event.value).unix());
    if (isUndefined(this.timeSelection.find(e => e.timeTo === newDate.timeTo))) {
      this.timeSelection.push(newDate);
    } else {
      this.timeSelection.splice(this.timeSelection.findIndex(e => e.timeTo === newDate.timeTo), 1);
    }
  }

}
