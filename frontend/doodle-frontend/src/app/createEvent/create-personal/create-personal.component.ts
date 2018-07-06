import {Component, Inject, OnInit} from '@angular/core';
import {CreateService} from '../../services/create.service';
import { StepperService } from '../../services/stepper-info.service';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-create-personal',
  templateUrl: './create-personal.component.html',
  styleUrls: ['./create-personal.component.css']
})
export class CreatePersonalComponent implements OnInit {

  createService: CreateService;
  constructor(@Inject(CreateService) createservice: CreateService, public stepperService: StepperService,
private adminService: AdminService) {
    this.createService = createservice;
  }

  readonly TITLE = 0;
  readonly NAME = 1
  readonly DESCRIPTION = 2;
  readonly LOCATION = 3;

  ngOnInit() {
    console.log("is create personal " + this.stepperService.isCreate);
  }
  setDetails() {
    this.createService.setDetails();
  }

  /**
   * in order to avoid undefined in the input values
   * @param inputType constant that represents an input field
   */
  returnInputValue(inputType){
   if(this.stepperService.isCreate){
      return this.returnCreateInputValue(inputType);
   }
   else{
     return this.returnEditInputValue(inputType);
   }
  }

  returnCreateInputValue(inputType){
    let inputValue = "";
    switch(inputType){
      case this.TITLE: inputValue = this.createService.event.title;
      break;
      case this.NAME: inputValue = this.createService.event.creator.name;
      break;
      case this.DESCRIPTION: inputValue = this.createService.event.description;
      break;
      case this.LOCATION: inputValue = this.createService.event.location;
      break;
    }
    return (inputValue == undefined)? "" : inputValue;
  }

  returnEditInputValue(inputType){
    let inputValue = "";
    switch(inputType){
      case this.TITLE: inputValue = this.adminService.stateTracker.getEventData().title;
      break;
      case this.DESCRIPTION: inputValue = this.adminService.stateTracker.getEventData().description;
      break;
      case this.LOCATION: inputValue = this.adminService.stateTracker.getEventData().location;
      break;
    }
    return (inputValue == undefined)? "" : inputValue;
  }

  handleNewInput(input, type){
    if(this.stepperService.isCreate){
      this.handleNewInputCreate(input, type);
    }
    else{
      this.handleNewInputEdit(input, type);
    }

  }

  handleNewInputCreate(input, type){
    
    switch(type){
      case this.TITLE: this.createService.event.title = input;
      break;
      case this.NAME: this.createService.creator.name = input;
      console.log("Creator name input: " + input);
      break;
      case this.DESCRIPTION: this.createService.event.description = input;
      break;
      case this.LOCATION: this.createService.event.location = input;
      break;
    }
  }

  handleNewInputEdit(input, type){
    switch(type){
      case this.TITLE: this.adminService.updatedValues.title = input;
      break;
      case this.DESCRIPTION: this.adminService.updatedValues.description = input;
      break;
      case this.LOCATION: this.adminService.updatedValues.location = input;
      break;
    }
  }


}
