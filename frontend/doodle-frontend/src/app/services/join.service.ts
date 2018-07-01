import { Injectable } from '@angular/core';
import {EventModel} from '../models/event.model';
import {DatesModel} from '../models/dates.model';
import {ParticipantModel} from '../models/participant.model';
import * as moment from 'moment';
import {CreatorModel} from '../models/creator.model';
import {HttpClient} from '@angular/common/http';
import {ServerModel} from '../models/server.model';
@Injectable()
export class JoinService {
  getURl = 'http://localhost:3000/event/';
  UUID: string;
  postURL = 'http://localhost:3000/participant/';
  votes = [];
  serverData: ServerModel;
  joiner = new ParticipantModel('Your Name');
  dataLoaded: boolean;
  constructor(private http: HttpClient) {
    moment.locale('en');
    this.dataLoaded = false;
  }
  postData() {
    console.log(this.joiner);
    this.http.post(this.postURL + this.UUID, this.joiner).subscribe(res => console.log(res));

  }
  getData() {
    console.log(this.serverData);
    this.http.get(this.getURl + this.UUID).subscribe(
      (data: any) => {
        const serverData = data.data[0];
        this.serverData = new ServerModel(serverData);
        this.joiner.dates = [];
        for (let i = 0; i < this.serverData.date.length; i++) {
          let votes = 0;
          for (let j = 0; j < this.serverData.participants.length; j++) {
            if (this.serverData.participants[j].dates[i] === true) {
              votes = votes + 1;
            }
          }
          this.votes.push(votes);
        }
        for (let i = 0; i < this.serverData.date.length; i++) {
          this.joiner.dates.push(false);
        }
      });
  }
}
