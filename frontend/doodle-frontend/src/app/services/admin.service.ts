import { Injectable } from '@angular/core';
import {EventModel} from '../models/event.model';
import {HttpClient} from '@angular/common/http';
import {CreatorModel} from '../models/creator.model';
import {DatesModel} from '../models/dates.model';
import {TimeselectionModel} from '../models/timeselection.model';
import * as moment from 'moment';
import { URLService } from './url-service';
import { AdminViewStateTracker } from './stateTracker/admin-view-stateTracker';
import { EventService } from './event.service';


@Injectable()

export class AdminService {
  postURL = '/event/new';
  postURL_update = '/event/update/';
  postURL_dateRemove = '/date/delete/';
  postURL_dateAdd = '/date/add/';
  postURL_deleteEvent = '/event/delete/';
  postURL_updateAdminDates = '/creator/date/update/';
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
    private URLService: URLService,
    private eventService: EventService
  ) {
    this.event = new EventModel();
    this.creator = new CreatorModel('dummy@web.de');
    this.postURL = this.URLService.getServerURL() + this.postURL;
    this.postURL_update = this.URLService.getServerURL() + this.postURL_update;
    this.postURL_dateRemove = this.URLService.getServerURL() + this.postURL_dateRemove;
    this.postURL_dateAdd = this.URLService.getServerURL() + this.postURL_dateAdd;
    this.postURL_deleteEvent = this.URLService.getServerURL() + this.postURL_deleteEvent;
    this.postURL_updateAdminDates = this.URLService.getServerURL() + this.postURL_updateAdminDates;
  }
  postData() {
    this.http.post(this.postURL, this.event).subscribe((data: any) => {
      console.log(data);
      this.adminID = data.data[0].creator.adminUUID;
      this.joinID = this.URLService.getFrontendURL + '/join/' + data.data[0].uuid;
    });

  }
  setDetails() {

    this.detailsBool = false;
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
    this.activateCalendar();
    this.http.post(this.postURL_update + this.stateTracker.getAdminId(), this.updatedValues).subscribe((data: any) => {
      console.log(data);
      if(<any>data.success){
        this.updateEventData();
      }
    });
  }


  indexesToDelete = [];
  removeDates(){
    let requestData = {indexesToDelete: this.indexesToDelete};
    this.http.post(this.postURL_dateRemove  + this.stateTracker.getAdminId(), requestData).subscribe((data: any) => {
      console.log(data);
      this.indexesToDelete = [];
      // wait for remove, then add dates
      this.setCalendarForAdminEdit();
    });
  }

  datesToAdd = [];
  addDatesToExistingEvent(){
    let requestData = {datesToAdd: this.datesToAdd};
    this.http.post(this.postURL_dateAdd  + this.stateTracker.getAdminId(), requestData).subscribe((data: any) => {
      console.log(data);
      if(<any>data.success){
        // reset selected times
        this.timeSelection = [];
        this.updateEventData();
      }
      
    });
  }

  /**
   * update event data that is displayed in admin edit
   */
  updateEventData(){
    this.eventService.getEventByAdminId(this.stateTracker.getAdminId()).subscribe(data =>{
      console.log(data);
      let response = <any>data;
      if(response.success){
        this.stateTracker.setEventData(response.data[0]);
      }
    });
  }

  setCalendarForAdminEdit() {
    for (let i = 0; i < this.timeSelection.length; i++) {
      this.datesToAdd.push(this.timeSelection[i].parseToTimeStamp());
    }
    this.addDatesToExistingEvent();
  }

  deleteEvent(){
    this.http.post(this.postURL_deleteEvent + this.stateTracker.getAdminId(), {}).subscribe((data: any) => {
      console.log(data);
    });
  }

  updateAdminDates(updatedDates){
    let request = {updatedDates: updatedDates};
    this.http.post(this.postURL_updateAdminDates + this.stateTracker.getAdminId(), request).subscribe((data: any) => {
      console.log(data);
    });
  }


  activateCalendar(){
    this.detailsBool = false;
    this.calendarBool = true;
    this.summaryBool = false;
  }

  activateDetails(){
    this.detailsBool = true;
    this.calendarBool = false;
    this.summaryBool = false;
  }

  activateAdminOption(){
    this.detailsBool = false;
    this.summaryBool = true;
    this.calendarBool = false;
  }
}
