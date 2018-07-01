let partMock = require('./mockData/participant');

module.exports = class EventValueTracker{

    constructor() { }

    setUUID(uuid){
        this.uuid = uuid;
    }
    getUUID(){
        return this.uuid;
    }

    setAdminUUID(adminUUID){
        this.adminUUID = adminUUID;
    }
    getAdminUUID(){
        return this.adminUUID;
    }

    setRes(res){
        this.res = res;
    }
    getRes(){
        return this.res;
    }

    setEvent(event){
        this.event = event;
    }
    getEvent(){
        return this.event;
    }
    getCreator(){
        return this.event.creator;
    }

    setAdminEvent(adminEvent){
        this.adminEvent = adminEvent;
    }
    getAdminEvent(){
        return this.adminEvent;
    }
    getAdminCreator(){
        return this.adminEvent.creator;
    }
    setDate(date){
        this.event.date = date;
    }
    getDate(){
        return this.event.date;
    }
   
    initNumberParticipants(){
        this.numberParticipants = 0;
    }
    getNumberParticipants(){
        return this.numberParticipants;
    }
    getIndexNewParticipant(){
        return this.numberParticipants - 1
    }
    incrementParticipants(){
        this.numberParticipants++;
    }
    decreaseParticipants(){
        if(this.numberParticipants > 0){
            this.numberParticipants--;
        }
        else{
            throw new Error("You can't remove a participant if there aren't any");
        }
        
    }
    
    setMockDatesForPart(datesBoolMock){
        this.datesBoolMock = datesBoolMock;
    }
    getMockDatesForPart(){
        return this.datesBoolMock;
    }
}