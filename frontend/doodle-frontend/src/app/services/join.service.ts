import { Injectable } from '@angular/core';
import {EventModel} from '../models/event.model';
import {DatesModel} from '../models/dates.model';
import {ParticipantModel} from '../models/participant.model';
import * as moment from 'moment';
@Injectable()
export class JoinService {
  votes = [];
  joiner = new ParticipantModel('Your Name');
  testDates: DatesModel [] = [];
  testParticipants: ParticipantModel [] = [];
  event = new EventModel();
  dataLoaded: boolean;
  constructor() {
    moment.locale('en');
    this.dataLoaded = false;
  }
  loadData() {
    const day1 = new DatesModel(1530374400, 1530381600);
    const day2 = new DatesModel(1530460800, 1530468000);
    this.testDates.push(day1);
    this.testDates.push(day2);
    const testUser = new ParticipantModel('Sven');
    testUser.selection = [true, false];
    const testUser3 = new ParticipantModel('Jorg');
    testUser3.selection = [true, true];
    const testUser2 = new ParticipantModel('Eric');
    testUser2.selection = [true, true];
    this.testParticipants.push(testUser);
    this.testParticipants.push(testUser2);
    this.testParticipants.push(testUser3);
    this.event.dates = this.testDates;
    this.event.participants = this.testParticipants;
    this.event.description = 'TestDescription';
    this.event.creator = 'Hannes';
    this.event.title = 'My First Event';
    console.log(this.event);
    for (let i = 0; i < this.event.dates.length; i++) {
      let votes = 0;
      for (let j = 0; j < this.event.participants.length; j++) {
        if (this.event.participants[j].selection[i] === true) {
          votes = votes + 1;
        }
      }
      this.votes.push(votes);
    }
    this.dataLoaded = true;
    for (let i = 0; i < this.event.dates.length; i++) {
      this.joiner.selection.push(false);
    }

    console.log(this.votes);
  }
  submitData() {
  }
}
