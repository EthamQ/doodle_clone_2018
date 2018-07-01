import { Injectable } from '@angular/core';
import {EventModel} from '../models/event.model';
import {HttpClient} from '@angular/common/http';
import {CreatorModel} from '../models/creator.model';
import {DatesModel} from '../models/dates.model';
import {TimeselectionModel} from '../models/timeselection.model';
import * as moment from 'moment';


@Injectable()

export class CreateService {
  postURL = 'http://10.150.133.137:3000/event/new';
  creator: CreatorModel;
  timeSelection: Array<TimeselectionModel> = [];
  event: EventModel;
  detailsBool = false;
  calendarBool = false;
  summaryBool = false;
  serverResponse: any;
  progress = 10;
  constructor(private http: HttpClient) {
    this.event = new EventModel();
    this.creator = new CreatorModel('dummy@web.de');
  }
  createDummy() {
    const date1 = new DatesModel( 1531864800, 1531864800);
    this.event.title = 'DoodleÜberWeb';
    this.event.description = 'Eine Beschreibung';
    this.event.eventType = 'Geburtstag';
    this.event.creator = new CreatorModel( 's@web.de');
    this.event.date.push(date1);
    console.log(this.event);
  }
  postData() {
    this.http.post(this.postURL, this.event).subscribe(res => console.log(res));

  }
  setDetails() {
    this.detailsBool = true;
    this.progress += 30;

  }
  setCalendar() {
    for (let i = 0; i < this.timeSelection.length; i++) {
      this.event.date.push(this.timeSelection[i].parseToTimeStamp());
    }
    this.calendarBool = true;
    this.progress += 30;
    this.postData();
  }
}
