const ModelClass = require('./../doodleModel');
let constructorArgs = require('./doodleParticipantModelValues');

module.exports = class Participant extends ModelClass{

    constructor() {
        super(constructorArgs.model, constructorArgs.allowedKeys, constructorArgs.requiredKeys, constructorArgs.dbInfo);
    }

    setIsEventCreator(){
        this.model.isEventCreator = true;
    }
}