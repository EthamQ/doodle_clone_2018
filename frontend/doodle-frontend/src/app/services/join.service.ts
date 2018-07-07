import { Injectable } from '@angular/core';

import { ParticipantModel } from '../models/participant.model';
import * as moment from 'moment';
import { HttpClient } from '@angular/common/http';
import { ServerModel } from '../models/server.model';
import { URLService } from './url-service';
import {ActivatedRoute, Router} from '@angular/router';

@Injectable()
export class JoinService {

  getURl = '/event/';
  UUID: string;
  postURL = '/participant/';
  votes = [];
  redirectUrl: string;
  viewNav: string;
  serverData: ServerModel;
  joiner = new ParticipantModel('Your Name');
  dataLoaded: boolean;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private URLService: URLService
  ) {
    moment.locale('en');
    this.dataLoaded = false;
    this.getURl = this.URLService.getServerURL() + this.getURl;
    this.postURL = this.URLService.getServerURL() + this.postURL;
  }
  postData() {
    console.log('in postData: ');
    console.log(this.joiner);
    this.http.post(this.postURL + this.UUID, this.joiner).subscribe((res: any) =>{
      if(!res.success){
        console.log("error");
      }
    });

  }

  /**
   * gives you the possibility to wait until the participant
   * is actually in the database, only then the callback is called
   * @param callback
   */
  postDataAndWait(callback) {
    this.http.post(this.postURL + this.UUID, this.joiner).subscribe(res => {
      console.log(res);
      callback();
    });
  }
  getDataAndWait(callback) {
    this.http.get(this.getURl + this.UUID).subscribe(data => {
      callback(data);
    });
  }
  getData() {
    if (!this.dataLoaded) {
      this.getDataAndWait((data: any) => {
        if (data.success) {
          console.log(data);
          const serverData = data.data[0];
          // add creator to participants array so he is displayed as participant in  join as well
          serverData.participants.push(data.data[0].creator);
          this.serverData = new ServerModel(serverData);
          this.viewNav = '../../view/' + this.UUID;
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
          this.dataLoaded = data.success;
          this.router.navigate(['../../join/' + this.UUID] );
        } else {
          this.dataLoaded = data.success;
          this.router.navigate(['join']);
        }
      });
    }
  }
  reset() {
    this.UUID = undefined;
    this.redirectUrl = undefined;
    this.votes = [];
    this.serverData = undefined;
    this.joiner = new ParticipantModel('Your Name');
    this.dataLoaded = undefined;
  }
}
