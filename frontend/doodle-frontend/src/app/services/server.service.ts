import { Injectable } from '@angular/core';
import {DatesModel} from "../models/dates.model";
import {ParticipantModel} from "../models/participant.model";
import {ResultModel} from "../models/result.model";


@Injectable()

export class ServerService {
  getURL = 'http://localhost:3000/';
  constructor() {

  }

  createEvent(){
    const url ='event/new';

  }

}
