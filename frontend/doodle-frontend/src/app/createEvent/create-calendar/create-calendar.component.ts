import {Component, EventEmitter, Inject, OnInit} from '@angular/core';
import {CreateService} from '../../services/create.service';
import * as moment from 'moment';
import {DateButton, DlDateTimePickerChange} from 'angular-bootstrap-datetimepicker';
import {TimeselectionModel} from '../../models/timeselection.model';
import {isUndefined} from 'util';
import * as deepEqual from 'deep-equal';

import { AdminService } from '../../services/admin.service';
import { StepperService } from '../../services/stepper-info.service';


@Component({
  selector: 'app-create-calendar',
  templateUrl: './create-calendar.component.html',
  styleUrls: ['./create-calendar.component.scss']
})
export class CreateCalendarComponent implements OnInit {
  createService: CreateService;
  relevantService;
  constructor(@Inject(CreateService) createservice: CreateService, private adminService: AdminService,
public stepperService: StepperService) {
    this.createService = createservice;
  }

  ngOnInit() {
    this.relevantService = this.stepperService.isCreate? this.createService : this.adminService;
  }

  /**
   * user selects a date on the calender
   * @param event
   */
  handleEvent(event: any) {
    const newDate = new TimeselectionModel();
    newDate.setTimeFrom(moment(event.value).unix());
    newDate.setTimeTo(moment(event.value).unix());
    console.log(newDate);
    this.selectionAlreadyExists(newDate, exists =>{
      if(!exists){
        if(this.stepperService.isCreate){
          this.createService.timeSelection.push(newDate);
        }
        else{
          this.adminService.timeSelection.push(newDate);
        }
      }
      else{
        console.log("Date already exists");
      }
    });
  }

  /**
   * callback true if date has already been selected else false
   */
  selectionAlreadyExists(selectedTime, callback){
    // is first date
    if(this.createService.timeSelection.length == 0){
      callback(false);
    }
    let i = 0;
    this.createService.timeSelection.map(time =>{
      if(deepEqual(time, selectedTime)){
        callback(true);
      }
      // end off array nothing found
      else if(i === this.createService.timeSelection.length-1){
        callback(false);
      }
      i++;
    });
  }

  /**
   * click on the remove icon, removes date from the users's selection
   * @param index
   */
  removeDate(index){
    this.createService.timeSelection.splice(index, 1);
  }

  removeExistingDate(index){
    if(!this.dateToBeRemoved(index)){
      this.adminService.indexesToDelete.push(index);
    }
  }

  revertSelection(index){
    for(let i = 0; i<this.adminService.indexesToDelete.length; i++){
      if(this.adminService.indexesToDelete[i] == index){
        this.adminService.indexesToDelete.splice(i, 1);
      }
  }
  }

  dateToBeRemoved(index){
    for(let i = 0; i<this.adminService.indexesToDelete.length; i++){
        if(this.adminService.indexesToDelete[i] == index){
          return true;
        }
    }
    return false;
  }

  setCalendar() {
    this.createService.setCalendar();
  }
}
