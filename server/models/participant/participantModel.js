const ModelClass = require('./../doodleModel');
let constructorArgs = require('./participantModelValues');

module.exports = class Participant extends ModelClass{

    constructor() {
        super(constructorArgs.getNewModel(), 
        constructorArgs.allowedKeys,
        constructorArgs.requiredKeys,
        constructorArgs.dbInfo
    );
    }

    setUUID(uuid, callback){
        this.model.eventUUID = uuid;
        callback();
    }

    participantDatesValid(dateArray){
       return this.model.dates.length === dateArray.length;
    }


}