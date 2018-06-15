var fillModel = require('./fillModels.js');
var uuid = require('uuid/v4');
var dateM = require('./doodleDateModel');

module.exports = class doodleEventModel{

    constructor() {
        // define model
        this.model = {
            title: null,
            description: null,
            isActive: true,
            eventType: null,
            location: null,
            numberParticipants: 1,
            creatorEvent: {},
            participants: [],
            date: [],
            uuid: null,
            url: 'http://doodleEvent/'
        };
        // all keys the user is allowed to set with a request
        this.allowedKeys = [
            'title',
            'description',
            'location',
            'eventType',
        ]
    }
    
    getDoodleEventModel(){
        return this.model;
    }

    // look for the 'key' in this model and assign 'value' to it
    setModelProperty(event){
        for (let key in event) {
            fillModel.fillModelProperty(this.allowedKeys, this.model, key, event[key]);
            if(key == 'date'){
                this.addDates(event[key]);
            }
        }  
    }

    // generate uuid and add it to url
    setDoodleEventModelUUID(){
        let newUUID = uuid();
        this.model.uuid = newUUID;
        this.model.url += newUUID;
    }

    addDates(dateArray){
        dateArray.map(date =>{
            let dateModel = new dateM();
            dateModel.setModelProperty(date);
            this.model.date.push(dateModel.getNewDateModel());
        });
    }

    // addCreatorOfEvent(creator){
    //     this.model.creatorEvent = {
    //         name: creator.name,
    //         email: creator.email
    //     }
    // }

    // addParticipiant(participant){
    //     this.model.participants.push(
    //         {
    //             name: participant.name,
    //             email: participant.email
    //         }
    //     );
    // }

}


