import { Injectable } from '@angular/core';
import { EventModel } from '../models/event.model';
import { HttpClient } from '@angular/common/http';
import { CreatorModel } from '../models/creator.model';
import { DatesModel } from '../models/dates.model';
import { TimeselectionModel } from '../models/timeselection.model';
import * as moment from 'moment';
import { URLService } from './url-service';
import { AdminViewStateTracker } from './stateTracker/admin-view-stateTracker';
import { EventService } from './event.service';


@Injectable()

export class AdminService {

  // stores all the relevant values of the event edited by the admin
  stateTracker: AdminViewStateTracker;
  // update main event values as admin
  postURL_update = '/event/update/';
  updatedValues: any = {
    title: "",
    location: "",
    description: "",
    eventType: ""
  }
  // remove dates from as admin
  postURL_dateRemove = '/date/delete/';
  indexesToDelete: number[] = [];
  // add dates to event as admin
  postURL_dateAdd = '/date/add/';
  datesToAdd: any[] = [];
  // delete an event
  postURL_deleteEvent = '/event/delete/';
  // update dates array of admin
  postURL_updateAdminDates = '/creator/date/update/';
  // create event as admin
  postURL = '/event/new';
  adminID: string;
  joinID: string;
  creator: CreatorModel;
  timeSelection: Array<TimeselectionModel> = [];
  event: EventModel;
  serverResponse: any;
  // values to indicate the state of the stepper in admin option view
  detailsBool = false;
  calendarBool = false;
  summaryBool = false;
  progress = 10;
  isLoading = false;

  constructor(
    private http: HttpClient,
    private URLService: URLService,
    private eventService: EventService
  ) {
    this.event = new EventModel();
    this.creator = new CreatorModel('dummy@web.de');
    this.initUrls();  
  }

  /**
   * depending on if we're working locally or on the lmu server
   * we're initilizing different front and backend urls
   */
  initUrls(){
    this.postURL = this.URLService.getServerURL() + this.postURL;
    this.postURL_update = this.URLService.getServerURL() + this.postURL_update;
    this.postURL_dateRemove = this.URLService.getServerURL() + this.postURL_dateRemove;
    this.postURL_dateAdd = this.URLService.getServerURL() + this.postURL_dateAdd;
    this.postURL_deleteEvent = this.URLService.getServerURL() + this.postURL_deleteEvent;
    this.postURL_updateAdminDates = this.URLService.getServerURL() + this.postURL_updateAdminDates;
  }

  /**
   * update title, location, description of an event in the database
   */
  updateMainEventValues(done) {
    this.activateCalendar();
    if (this.shouldUpdateValues()) {
      this.isLoading = true;
      this.http.post(this.postURL_update + this.stateTracker.getAdminId(), this.updatedValues).subscribe((data: any) => {
        console.log(data);
        if (data.success) {
          this.updateEventDataGetObservable().subscribe((data: any)=>{
            console.log(data);
            if (data.success) {
              this.stateTracker.setEventData(data.data[0]);
              done();
            }
          });
        }
      });
    }
  }

  /**
   * user click on update values in the admin date view
   * deletes or adds dates to the event if selected by the user
   */
  handleAdminDateChanges(done) {
    // call delete and add
    if (this.shouldDeleteDates() && this.shouldAddDates()) {
      this.isLoading = true;
      // delete
      this.removeDates().subscribe(data => {
        console.log(data);
        // reset
        this.indexesToDelete = [];
        // add
        this.setAndAddDates(() => {
          this.updateEventDataGetObservable().subscribe((data: any)=>{
            console.log(data);
            if (data.success) {
              this.stateTracker.setEventData(data.data[0]);
              done();
            }
          });
        });
      });
    }
    // call only delete
    else if (this.shouldDeleteDates()) {
      this.isLoading = true;
      console.log("only delete");
      this.removeDates().subscribe(data => {
        console.log(data);
        // reset
        this.indexesToDelete = [];
        this.updateEventDataGetObservable().subscribe((data: any)=>{
          console.log(data);
          if (data.success) {
            this.stateTracker.setEventData(data.data[0]);
            done();
          }
        });
      });
    }
    // call only add
    else if (this.shouldAddDates()) {
      this.isLoading = true;
      console.log("only add");
      this.setAndAddDates(() => {
        console.log("update now");
        this.updateEventDataGetObservable().subscribe((data: any)=>{
          console.log(data);
          if (data.success) {
            this.stateTracker.setEventData(data.data[0]);
            done();
          }
        });
      });
    }
  }

  /**
   * calls setCalendarForAdminEdit() to init the datesToAdd array
   * then adds the dates of datesToAdd to the database
   * @param done 
   */
  setAndAddDates(done) {
    this.setCalendarForAdminEdit(() => {
      this.addDatesToExistingEvent().subscribe((data: any) => {
        console.log(data);
        if (data.success) {
          // reset selected times
          this.timeSelection = [];
          this.datesToAdd = [];
          done();
        }
      });
    });
  }

  /**
   * did the admin select dates he wants to delete?
   */
  shouldDeleteDates() {
    return this.indexesToDelete.length > 0;
  }

  /**
   * did the admin select dates he wants to add?
   */
  shouldAddDates() {
    return this.timeSelection.length > 0;
  }

  /**
   * did the admin change any of the main values of the event?
   */
  shouldUpdateValues() {
    let shouldUpdate = (
      this.updatedValues.title == this.stateTracker.getEventData().title
      && this.updatedValues.description == this.stateTracker.getEventData().description
      && this.updatedValues.location == this.stateTracker.getEventData().location
      && this.updatedValues.eventType == this.stateTracker.getEventData().eventType
    );
    return !shouldUpdate;
  }

  /**
   * remove the dates from the event that are stored in this.indexesToDelete
   */
  removeDates() {
    let requestData = { indexesToDelete: this.indexesToDelete };
    return this.http.post(this.postURL_dateRemove + this.stateTracker.getAdminId(), requestData);
  }

  /**
   * admin edit component stores new dates in timeSelection
   * parse them for the server and add them to datesToAdd
   */
  setCalendarForAdminEdit(done) {
    for (let i = 0; i < this.timeSelection.length; i++) {
      this.datesToAdd.push(this.timeSelection[i].parseToTimeStamp());
    }
    done();
  }

  /**
   * add the dates to an event
   */
  addDatesToExistingEvent() {
    let requestData = { datesToAdd: this.datesToAdd };
    return this.http.post(this.postURL_dateAdd + this.stateTracker.getAdminId(), requestData);
  }

  /**
   * update event data that is displayed in admin edit
   * just get all the event data again and store them in the stateTracker
   */
  updateEventData() {
      this.eventService.getEventByAdminId(this.stateTracker.getAdminId()).subscribe((data: any) => {
        console.log(data);
        if (data.success) {
          this.stateTracker.setEventData(data.data[0]);
          this.isLoading = false;
        }
      });
  }

  updateEventDataGetObservable() {
    return this.eventService.getEventByAdminId(this.stateTracker.getAdminId());
}

  /**
   * delete an event as admin
   */
  deleteEvent() {
    this.http.post(this.postURL_deleteEvent + this.stateTracker.getAdminId(), {}).subscribe((data: any) => {
      console.log(data);
    });
  }

  /**
   * send a new boolean array of admin dates to the server which
   * replace the old one, called in admin options in admin edit
   * @param updatedDates 
   */
  updateAdminDates(updatedDates, done) {
    let request = { updatedDates: updatedDates };
    this.http.post(this.postURL_updateAdminDates + this.stateTracker.getAdminId(), request).subscribe((data: any) => {
      console.log(data);
      this.updateEventDataGetObservable().subscribe((data: any)=>{
        console.log(data);
        if (data.success) {
          this.stateTracker.setEventData(data.data[0]);
          done();
        }
      });
    });
  }


  /**
   * admin edit stepper: update calendar is active
   */
  activateCalendar() {
    this.calendarBool = true;
    this.detailsBool = false;
    this.summaryBool = false;
  }

   /**
   * admin edit stepper: update details is active
   */
  activateDetails() {
    this.detailsBool = true;
    this.calendarBool = false;
    this.summaryBool = false;
  }

   /**
   * admin edit stepper: admin options is active
   */
  activateAdminOption() {
    this.summaryBool = true;
    this.detailsBool = false;
    this.calendarBool = false;
  }
}
