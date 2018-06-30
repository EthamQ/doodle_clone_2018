import { Injectable } from '@angular/core';
import {EventModel} from '../models/event.model';
import {DatesModel} from '../models/dates.model';
import {ParticipantModel} from '../models/participant.model';
const moment = require('moment/moment');
@Injectable()
export class JoinService {
  joiner = new ParticipantModel('Joiner');
  testDates: DatesModel [] = [];
  testParticipants: ParticipantModel [] = [];
  event = new EventModel();
  dataLoaded: boolean;
  constructor() {
    moment.locale('en');
    this.dataLoaded = false;
  }
  loadData() {
    //get Event by Id
    console.log(this.getHour(1530460800));
    const day1 = new DatesModel(1530374400, 1530381600);
    const day2 = new DatesModel(1530460800, 1530468000);
    this.testDates.push(day1);
    this.testDates.push(day2);
    const testUser = new ParticipantModel('Sven');
    testUser.selection = [true, false];
    this.testParticipants.push(testUser);
    this.event.dates = this.testDates;
    this.event.participants = this.testParticipants;
    this.event.description = 'TestDescription';
    this.event.creator = 'Hannes';
    this.event.title = 'My First Event';
    this.dataLoaded = true;
    for (let i = 0; i < this.event.dates.length; i++) {
      this.joiner.selection.push(false);
    }
    console.log(this.event);
  }
  submitData() {
    //post data to server
  }
  getMonth(timestamp) {


  }
  getDay(timestamp) {

  }
  getHour(timestamp) {
    return moment(timestamp).format('LT');
  }
}
