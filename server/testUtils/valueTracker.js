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
   
    
}