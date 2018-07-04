import { Injectable } from '@angular/core';

@Injectable()
export class AdminViewStateTracker{
    private editViewActive = true;
    private adminId: string;
    private eventData: any;

    constructor(){}

    setEditActive(boolean){
        this.editViewActive = boolean;
    }

    getEditActive(){
        return this.editViewActive;
    }

    setAdminId(adminId){
        this.adminId = adminId;
    }

    getAdminId(){
        return this.adminId;
    }

    showAdminEdit(){
        return this.editViewActive;
    }

    showAdminLanding(){
        return !this.editViewActive;
    }

    setEventData(eventData){
        this.eventData = eventData;
    }

    getEventData(eventData){
        return this.eventData;
    }
}