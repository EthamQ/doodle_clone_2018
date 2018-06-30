const ModelClass = require('./../doodleModel');
const constructorArgs = require('./dateModelValues');

module.exports = class DateModel extends ModelClass{
    constructor() {
        super(constructorArgs.getNewModel(), 
        constructorArgs.allowedKeys,
        constructorArgs.requiredKeys,
        constructorArgs.dbInfo
    );
    }
}