const ModelClass = require('./../doodleModel');
let constructorArgs = require('./doodleParticipantModelValues');

module.exports = class Participant extends ModelClass{

    constructor() {
        super(constructorArgs.getNewModel(), constructorArgs.allowedKeys, constructorArgs.requiredKeys, constructorArgs.dbInfo);
    }

    setUUID(uuid, callback){
        this.model.eventUUID = uuid;
        callback();
    }

    setDates(dateArray){
        return new Promise((resolve, reject)=>{
            dateArray.map(date => {
                this.model.dates.push({ dateId: date._id, participates: false });
            });
            resolve();
        });
    }


}