const ModelClass = require('./../doodleModel');
const constructorArgs = require('./creatorModelValues');
const uuid = require('uuid/v4');

module.exports = class CreatorModel extends ModelClass{
    constructor() {
        super(constructorArgs.getNewModel(), 
        constructorArgs.allowedKeys,
        constructorArgs.requiredKeys,
        constructorArgs.dbInfo
    );
    }

    setAdminUUID(){
        this.model.adminUUID = uuid();
    }
}