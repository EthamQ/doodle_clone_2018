import { Injectable } from '@angular/core';
import {ParticipantModel} from "../models/participant.model";
import {CreatorModel} from "../models/creator.model";
import {EventModel} from "../models/event.model";
import {DatesModel} from "../models/dates.model";


@Injectable()

export class DataService {
  event: EventModel;
  constructor() {
    this.event = new EventModel();
  }


  addParticipant(){}
  addDate(uDate: number, uTimeFrom: number, uTimeTo: number){
    const date = new DatesModel(uDate, uTimeFromm, uTimeTo);
    this.event.addDate(date);
  }
  addCreator(name:string, mail:string) {
    this.event.setCreator(new CreatorModel(name, mail));
  }

}
