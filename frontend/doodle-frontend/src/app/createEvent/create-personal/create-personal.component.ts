import {Component, Inject, OnInit} from '@angular/core';
import {CreateService} from '../../services/create.service';
import { StepperService } from '../../services/stepper-info.service';

@Component({
  selector: 'app-create-personal',
  templateUrl: './create-personal.component.html',
  styleUrls: ['./create-personal.component.css']
})
export class CreatePersonalComponent implements OnInit {

  createService: CreateService;
  constructor(@Inject(CreateService) createservice: CreateService, public stepperService: StepperService) {
    this.createService = createservice;
  }

  readonly TITLE = 0;
  readonly NAME = 1
  readonly DESCRIPTION = 2;

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
      return this.returnCreateInput(inputType);
   }
   else{
     return this.returnEditInput(inputType);
   }
  }

  returnCreateInput(inputType){
    let inputValue = "";
    switch(inputType){
      case this.TITLE: inputValue = this.createService.event.title;
      break;
      case this.NAME: inputValue = this.createService.event.creator.name;
      break;
      case this.DESCRIPTION: inputValue = this.createService.event.description;
      break;
    }
    return (inputValue == undefined)? "" : inputValue;
  }

  returnEditInput(inputType){
    let inputValue = "";
    switch(inputType){
      case this.TITLE: inputValue = "Edit title";
      break;
      case this.NAME: inputValue = "Edit name";
      break;
      case this.DESCRIPTION: inputValue = "Edit description";
      break;
    }
    return inputValue;
  }

  handleNewInput(input, type){
    if(this.stepperService.isCreate){
      this.handleNewInputCreate(input, type);
    }
    else{

    }

  }

  handleNewInputCreate(input, type){
    switch(type){
      case this.TITLE: this.createService.event.title = input;
      break;
      case this.NAME: this.createService.event.creator.name = input;
      break;
      case this.DESCRIPTION: this.createService.event.description = input;
      break;
    }
  }

  handleNewInputEdit(input){
    
  }


}
