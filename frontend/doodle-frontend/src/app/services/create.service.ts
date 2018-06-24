import { Injectable } from '@angular/core';
import {DatesModel} from "../models/dates.model";
import {CreatorModel} from "../models/creator.model";
import * as EmailValidator from 'email-validator';



@Injectable()

export class CreateService {
  progress = 10;
  selectedDays: DatesModel[] = [];
  userInformation: CreatorModel = new CreatorModel();
  informationBool = true;
  dataBool = true;
  selectionBool = true;
  constructor() {


  }
  addDay(day:DatesModel){
    this.selectedDays.push(day);
  }
  informationEnter(){
    if(this.userInformation.name == 'Name'){
      alert('Bitte gib deinen Richtigen Namen ein')
    }
    if(!this.checkMail(this.userInformation.email)){
      alert('Bitte gib eine Richtige Email ein')
    }
    if(this.checkMail(this.userInformation.email) && this.userInformation.name != 'Name'){
      this.informationBool = true;
      this.progress += 30;
    }
  }
  dataEnter(){
    this.dataBool = true;
    this.progress += 30;
  }
  summary(){
    this.selectionBool = true;
    this.progress = 100;
  }
  checkMail(mail:string){
    return EmailValidator.validate(mail);
  }

}
