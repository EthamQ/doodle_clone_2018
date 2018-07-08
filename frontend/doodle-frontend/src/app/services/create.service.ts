import { Injectable } from '@angular/core';
import {EventModel} from '../models/event.model';
import {HttpClient} from '@angular/common/http';
import {CreatorModel} from '../models/creator.model';
import {DatesModel} from '../models/dates.model';
import {TimeselectionModel} from '../models/timeselection.model';
import * as moment from 'moment';
import { URLService } from './url-service';


@Injectable()

export class CreateService {
  postURL = '/event/new';
  redirectUrl: string;
  adminID: string;
  joinID: string;
  default_time = new TimeselectionModel();
  // is filled by event create and then assigned to event model in postData()
  creator: CreatorModel;
  timeSelection: Array<TimeselectionModel> = [];
  event: EventModel;
  detailsBool = false;
  calendarBool = false;
  summaryBool = false;
  isLoading = false;
  constructor(
    private http: HttpClient,
    private URLService: URLService
  ) {
    this.default_time.setTimeTo(0);
    this.default_time.setTimeFrom(0);
    this.event = new EventModel();
    this.creator = new CreatorModel('dummy@web.de');
    this.postURL = this.URLService.getServerURL() + this.postURL;
  }
  postData() {
    this.event.creator = this.creator;
    console.log(this.event);
    this.http.post(this.postURL, this.event).subscribe((data: any) => {
      console.log(data);
      this.adminID = data.data[0].creator.adminUUID;
      this.joinID = this.URLService.getFrontendURL() + '/join/' + data.data[0].uuid;
      this.isLoading = false;
    });

  }
  reset() {
    this.event = new EventModel();
    this.adminID = undefined;
    this.calendarBool = false;
    this.detailsBool = false;
    this.summaryBool = false;
    this.default_time = new TimeselectionModel();
    this.default_time.setTimeTo(0);
    this.default_time.setTimeFrom(0);
    this.event = new EventModel();
    this.timeSelection = [];
    this.joinID = undefined;
    this.creator = new CreatorModel('dummy@web.de');
    this.isLoading = false;
  }
  setDetails() {
    this.detailsBool = true;

  }
  setAllStart() {
    for (let i = 0; i < this.timeSelection.length; i++) {
      this.timeSelection[i].startAMPM = this.default_time.startAMPM;
      this.timeSelection[i].startMinute = this.default_time.startMinute;
      this.timeSelection[i].startHour = this.default_time.startHour;
    }
  }
  setAllStop() {
    for (let i = 0; i < this.timeSelection.length; i++) {
      this.timeSelection[i].stopAMPM = this.default_time.stopAMPM;
      this.timeSelection[i].stopMinute = this.default_time.stopMinute;
      this.timeSelection[i].stopHour = this.default_time.stopHour;
    }
  }
  setCalendar() {
    for (let i = 0; i < this.timeSelection.length; i++) {
      this.event.date.push(this.timeSelection[i].parseToTimeStamp());
    }
    this.event.creator = this.creator;
    this.calendarBool = true;
    this.postData();
  }
}
