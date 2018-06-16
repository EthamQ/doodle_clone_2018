var fillModel = require('./../fillModels.js');
const ModelClass = require('./../doodleModel');
const constructorArgs = require('./doodleDateModelValues');

module.exports = class DateModel extends ModelClass{
    constructor() {
        super(constructorArgs.model, constructorArgs.allowedKeys, constructorArgs.requiredKeys);
    }

}