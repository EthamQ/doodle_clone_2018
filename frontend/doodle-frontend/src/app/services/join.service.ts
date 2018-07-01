import { Injectable } from '@angular/core';
import {EventModel} from '../models/event.model';
import {DatesModel} from '../models/dates.model';
import {ParticipantModel} from '../models/participant.model';
import * as moment from 'moment';
import {CreatorModel} from '../models/creator.model';
@Injectable()
export class JoinService {
  getURl = '';
  postURL = '';
  votes = [];
  joiner = new ParticipantModel('Your Name');
  event = new EventModel();
  dataLoaded: boolean;
  constructor() {
    moment.locale('en');
    this.dataLoaded = false;
  }
  postData() {
    // this.http.post(this.postURL, this.event).subscribe(res => console.log(res));

  }
  loadData() {

    // this.http.get(this.getURL, this.event).subscribe(res => {console.log(res));
    for (let i = 0; i < this.event.date.length; i++) {
      let votes = 0;
      for (let j = 0; j < this.event.participants.length; j++) {
        if (this.event.participants[j].selection[i] === true) {
          votes = votes + 1;
        }
      }
      this.votes.push(votes);
    }
    this.dataLoaded = true;
    for (let i = 0; i < this.event.date.length; i++) {
      this.joiner.selection.push(false);
    }

    console.log(this.votes);
  }
}
