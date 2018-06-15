var fillModel = require('./fillModels.js');
var uuid = require('uuid/v4');
var dateM = require('./doodleDateModel');
const ModelClass = require('./doodleModel');
const ParticipantModel = require('./doodleParticipantModel');
const constructorArgs = require('./doodleEventModelValues');

module.exports = class doodleEventModel extends ModelClass{

    constructor() {
        super(constructorArgs.model, constructorArgs.allowedKeys);
    }
    
    // look for the 'key' in this model and assign 'value' to it
    setValues(event){
        this.setModelProperty(event);
        for (let key in event) {
            if(key == 'date'){
                this.addDates(event[key]);
            }
            if(key == 'participants'){
                this.addCreator(event[key]);
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
            this.model.date.push(dateModel.getModel());
        });
    }


    addCreator(participantArray){
        if(participantArray.length === 1){
            participantArray.map(creator =>{
                console.log("map 1");
                let participant = new ParticipantModel();
                participant.setIsEventCreator();
                participant.setModelProperty(creator); 
                // console.log(participant.getModel());
                this.model.participants.push(participant.getModel());
                this.model.numberParticipants++;
            });
        }
        else{
            console.log("throw error, more than one creator!");
        }
      
       
    }

}


