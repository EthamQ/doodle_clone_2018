import { Injectable } from '@angular/core';
import {DatesModel} from "../models/dates.model";
import {ParticipantModel} from "../models/participant.model";
import {ResultModel} from "../models/result.model";


@Injectable()

export class DateService {
  getURL = 'http://localhost:xxxx/id/';
  personalData: ParticipantModel;
  selectedDates : DatesModel [] = [];
  particpants: ParticipantModel [] = [];
  result: ResultModel;
  constructor() {
    this.selectedDates.push(new DatesModel({tag:1, monat: 'Jul', wochentag: 'Mi' }));
    this.selectedDates.push(new DatesModel({tag:2, monat: 'Jul', wochentag: 'Do' }));
    this.selectedDates.push(new DatesModel({tag:3, monat: 'Jul', wochentag: 'Fr' }));
    this.selectedDates.push(new DatesModel({tag:4, monat: 'Jul', wochentag: 'Sa' }));
    this.selectedDates.push(new DatesModel({tag:5, monat: 'Jul', wochentag: 'So' }));
    this.selectedDates.push(new DatesModel({tag:6, monat: 'Jul', wochentag: 'Mo' }));
    this.selectedDates.push(new DatesModel({tag:7, monat: 'Jul', wochentag: 'Di' }));

    this.particpants.push(new ParticipantModel({name: 'Alexander'}));
    this.particpants.push(new ParticipantModel({name: 'Johanna'}));
    this.particpants.push(new ParticipantModel({name: 'Felix'}));
    this.result = new ResultModel();

  }
  enterName(inputName:string){
    this.personalData = new ParticipantModel({name: inputName});
    this.personalData.selection = [];
  }

}
