import { Injectable } from '@angular/core';
import * as moment from 'moment';
import {HttpClient} from '@angular/common/http';
import {ServerModel} from '../models/server.model';
@Injectable()
export class ViewService {
  getURl = 'http://10.150.133.137:3000/event/';
  UUID = '';
  votes = [];
  serverData: ServerModel;
  constructor(private http: HttpClient) {
    moment.locale('en');
  }
  getData() {
    console.log('getView');
    this.http.get(this.getURl + this.UUID).subscribe(
      (data: any) => {
        const serverData = data.data[0];
        this.serverData = new ServerModel(serverData);
        for (let i = 0; i < this.serverData.date.length; i++) {
          let votes = 0;
          for (let j = 0; j < this.serverData.participants.length; j++) {
            if (this.serverData.participants[j].dates[i] === true) {
              votes = votes + 1;
            }
          }
          this.votes.push(votes);
        }
        console.log(this.serverData);
      });
  }
}