const ModelClass = require('./../doodleModel');
let constructorArgs = require('./doodleParticipantModelValues');

module.exports = class Participant extends ModelClass{

    constructor() {
        super(constructorArgs.model, constructorArgs.allowedKeys, constructorArgs.requiredKeys);
    }

    setIsEventCreator(){
        this.model.isEventCreator = true;
    }
}