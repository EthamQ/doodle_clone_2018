var fillModel = require('./../fillModels.js');
const ModelClass = require('./../doodleModel');
const constructorArgs = require('./doodleDateModelValues');
const uuid = require('uuid/v4');

module.exports = class DateModel extends ModelClass{
    constructor() {
        super(constructorArgs.model, constructorArgs.allowedKeys, constructorArgs.requiredKeys, constructorArgs.dbInfo);
    for(let key in this.model){
        this.model[key] = null;
    }
    }

    setUUID(uuid){
        this.model.uuid = uuid;
    }

    setId(id){
        this.model._id = id;
    }

}