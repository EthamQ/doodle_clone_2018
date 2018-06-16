var fillModel = require('./../fillModels.js');
const ModelClass = require('./../doodleModel');
var uuid = require('uuid/v4');
var DateModel = require('./../date/doodleDateModel');
const ParticipantModel = require('./../participant/doodleParticipantModel');
const constructorArgs = require('./doodleEventModelValues');

module.exports = class doodleEventModel extends ModelClass{

    constructor() {
        super(constructorArgs.model, constructorArgs.allowedKeys);
    }
    
    // set properties of this model directly
    // if property is model use setModelProperty of the corresponding model class to assign values
    setValues(event){
        this.setModelProperty(event);
        // other models in this model
        for (let key in event) {
            switch(key){
                case 'date': this.addDates(event[key]);
                break;
                case 'participants': this.addCreator(event[key]);
                break;
            }
        }  
    }

    // generate uuid and add it to url
    setDoodleEventModelUUID(){
        let newUUID = uuid();
        this.model.uuid = newUUID;
        this.model.url += newUUID;
    }

    // add all dates in 'dateArray' to this EventModel
    addDates(dateArray){
        dateArray.map(date =>{
            let dateModel = new DateModel();
            dateModel.setModelProperty(date);
            this.model.date.push(dateModel.getModel());
        });
    }

    // add one participant with isCreator: true to this model
    addCreator(participantArray){
        if(participantArray.length === 1){
            participantArray.map(creator =>{
                let participant = new ParticipantModel();
                participant.setIsEventCreator();
                participant.setModelProperty(creator); 
                this.model.participants.push(participant.getModel());
                this.model.numberParticipants++;
            });
        }
        else{
            console.log("throw error, more than one creator or no creator!");
        }
    }

}


