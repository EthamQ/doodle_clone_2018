import { Injectable } from '@angular/core';
import {EventModel} from '../models/event.model';
import {HttpClient} from '@angular/common/http';
import {CreatorModel} from '../models/creator.model';
import {DatesModel} from '../models/dates.model';
import {TimeselectionModel} from '../models/timeselection.model';
import * as moment from 'moment';
import { URLService } from './url-service';
import { AdminViewStateTracker } from './stateTracker/admin-view-stateTracker';


@Injectable()

export class AdminService {
  postURL = '/event/new';
  postURL_update = '/event/update/';
  postURL_dateRemove = '/date/delete/';
  adminID: string;
  joinID: string;
  creator: CreatorModel;
  timeSelection: Array<TimeselectionModel> = [];
  event: EventModel;
  stateTracker: AdminViewStateTracker;
  detailsBool = false;
  calendarBool = false;
  summaryBool = false;
  serverResponse: any;
  progress = 10;
  constructor(
    private http: HttpClient,
    private URLService: URLService
  ) {
    this.event = new EventModel();
    this.creator = new CreatorModel('dummy@web.de');
    this.postURL = this.URLService.getServerURL() + this.postURL;
    this.postURL_update = this.URLService.getServerURL() + this.postURL_update;
    this.postURL_dateRemove = this.URLService.getServerURL() + this.postURL_dateRemove;
  }
  postData() {
    this.http.post(this.postURL, this.event).subscribe((data: any) => {
      console.log(data);
      this.adminID = data.data[0].creator.adminUUID;
      this.joinID = this.URLService.getFrontendURL + '/join/' + data.data[0].uuid;
    });

  }
  setDetails() {

    this.detailsBool = true;
    this.progress += 30;

  }
  setCalendar() {
    for (let i = 0; i < this.timeSelection.length; i++) {
      this.event.date.push(this.timeSelection[i].parseToTimeStamp());
    }
    this.event.creator = this.creator;
    this.calendarBool = true;
    this.progress += 30;
    this.postData();
  }

  updatedValues = {
    title: "",
    location: "",
    description: "",
    eventType: ""
}
  
  updateMainEventValues(){
    this.setDetails();
    this.http.post(this.postURL_update + this.stateTracker.getAdminId(), this.updatedValues).subscribe((data: any) => {
      console.log(data);
    });
  }


  indexesToDelete = [];
  removeDates(){
    let requestData = {indexesToDelete: this.indexesToDelete};
    this.http.post(this.postURL_dateRemove  + this.stateTracker.getAdminId(), requestData).subscribe((data: any) => {
      console.log(data);
    });
  }
}
