import {Component, Inject, OnInit} from '@angular/core';
import {CreateService} from '../../services/create.service';
import * as moment from 'moment';
import {DlDateTimePickerChange} from 'angular-bootstrap-datetimepicker';


@Component({
  selector: 'app-create-calendar',
  templateUrl: './create-calendar.component.html',
  styleUrls: ['./create-calendar.component.css']
})
export class CreateCalendarComponent implements OnInit {
  test:DateButton;
  constructor() {
  }

  ngOnInit() {
  }
  handleEvent(event: DlDateTimePickerChange) {
    console.log(event.value);
  }
}
