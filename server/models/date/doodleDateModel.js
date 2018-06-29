var fillModel = require('./../fillModels.js');
const ModelClass = require('./../doodleModel');
const constructorArgs = require('./doodleDateModelValues');
const uuid = require('uuid/v4');

module.exports = class DateModel extends ModelClass{
    constructor() {
        super(constructorArgs.getNewModel(), constructorArgs.allowedKeys, constructorArgs.requiredKeys, constructorArgs.dbInfo);
    }
}