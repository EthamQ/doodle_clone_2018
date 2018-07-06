import { Injectable } from '@angular/core';
import * as moment from 'moment';
import {HttpClient} from '@angular/common/http';
import {ServerModel} from '../models/server.model';
import { URLService } from './url-service';
@Injectable()
export class ViewService {
  getURl = '/event/';
  UUID = '';
  votes = [];
  serverData: ServerModel;
  constructor(
    private http: HttpClient,
    private URLService: URLService
  ) {
    moment.locale('en');
    this.getURl = this.URLService.getServerURL() + this.getURl;
  }
  getData() {
    console.log("inside getdata");
      this.http.get(this.getURl + this.UUID).subscribe(
        (data: any) => {
          console.log(data);
          if(data.success){
            
            console.log("inside get http");
          }
          
          const serverData = data.data[0];
          // add creator to participants array so he is displayed as a participant as well
          serverData.participants.push(data.data[0].creator);
          this.serverData = new ServerModel(serverData);
          console.log("Count votes");
          console.log(this.serverData.date);
          console.log(this.serverData.participants);
          // loop through every date
          for (let i = 0; i < this.serverData.date.length; i++) {
            let votes = 0;
            // loop through every participant
            for (let j = 0; j < this.serverData.participants.length; j++) {
              if (this.serverData.participants[j].dates[i] === true) {
                votes++;
              }
            }
            // so votes don't get pushed twice
              if(this.votes.length < this.serverData.date.length){
                this.votes.push(votes);
              }
          }
          console.log(this.serverData);
        });

  }
}
