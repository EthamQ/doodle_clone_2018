import {Component, Inject, OnInit} from '@angular/core';
import {CreateService} from '../../services/create.service';

@Component({
  selector: 'app-create-personal',
  templateUrl: './create-personal.component.html',
  styleUrls: ['./create-personal.component.css']
})
export class CreatePersonalComponent implements OnInit {

  createService: CreateService;
  constructor(@Inject(CreateService) createservice: CreateService) {
    this.createService = createservice;
  }

  readonly TITLE = 0;
  readonly NAME = 1
  readonly DESCRIPTION = 2;

  ngOnInit() {
  }
  setDetails() {
    this.createService.setDetails();
  }

  /**
   * in order to avoid undefined in the input values
   * @param inputType constant that represents an input field
   */
  returnInputValue(inputType){
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


}
