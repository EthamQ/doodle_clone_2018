import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URLService } from './url-service';

@Injectable()
export class EventService {

    constructor(private http: HttpClient, private URLService: URLService) { }

    getEventByAdminId(adminId){
        let requestUrl = this.URLService.getServerURL() + '/event/' + adminId;
        console.log("url: " + requestUrl);
        return this.http.get(requestUrl);
    }
}