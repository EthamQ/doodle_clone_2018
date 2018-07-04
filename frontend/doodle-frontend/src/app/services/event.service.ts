import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class EventService {

    constructor(private http: HttpClient) { }

    getEventByAdminId(adminId){
        // return this.http.get();
    }
}