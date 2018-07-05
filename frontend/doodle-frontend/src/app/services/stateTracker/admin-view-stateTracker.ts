import { Injectable } from '@angular/core';

@Injectable()
export class AdminViewStateTracker{
    private editViewActive = false;
    private adminId: string;
    private eventData: any;
    private adminAsArray: any[];

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
        this.setCreatorForDateEdit(eventData.creator)
    }

    getEventData(){
        return this.eventData;
    }

    setCreatorForDateEdit(admin){
        this.adminAsArray = [];
        this.adminAsArray.push(admin);
    }

    getCreatorForDateEdit(){
        return this.adminAsArray;
    }
}