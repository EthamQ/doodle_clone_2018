const fillModel = require('./../fillModels.js');
const ModelClass = require('./../doodleModel');
const uuid = require('uuid/v4');
const DateModel = require('./../date/doodleDateModel');
const ParticipantModel = require('./../participant/doodleParticipantModel');
const constructorArgs = require('./doodleEventModelValues');
const dbUtils = require('./../../MongoDB/dbUtils');

module.exports = class doodleEventModel extends ModelClass {

    constructor() {
        super(
            constructorArgs.getNewModel(),
            constructorArgs.allowedKeys,
            constructorArgs.requiredKeys,
            constructorArgs.dbInfo
        );
        this.datesAreValid = true;
    }

    // assign values to the properties of this models that are models or objects themselves
    setChildModelProperties(event, callback) {
        for (let key in event) {
            if (key == 'date') {
                this.addDatesToModel(event[key], () =>{
                    // make sure it is finished
                });
            }
            if (key == 'creator') {
                this.returnCreatorObject(event[key], creatorObject =>{
                    this.model.creator = creatorObject;
                });
            }
        }
        callback();
    }

    /**
     * generate and set this.model.uuid and this.model.timestamp
     */
    generateAndSetRequiredProperties() {
        this.setDoodleEventModelUUID();
        this.setTimestamp();
    }

    childModelsAreValid() {
        return this.datesAreValid;
    }

    // generate uuid and add it to url
    setDoodleEventModelUUID() {
        let newUUID = uuid();
        this.model.uuid = newUUID;
        this.model.url += newUUID;
        this.model._id = newUUID;
    }

    getModel() {
        return this.model;
    }

    setTimestamp() {
        this.model.timestamp = new Date().getTime();
    }

    /**
     * create a DateModel() for every date in dateArray and save 
     * it in the database
     * @param dateArray array of dates sent by the client
     * 
     * @param callback
     */
    addDatesToModel(dateArray, callback) {
        dateArray.map(date => {
            let dateModel = new DateModel();
            dateModel.setModelProperty(date, ()=>{
                this.model.date.push(dateModel.getModel());
            });
        });
        callback();
    }

    returnCreatorObject(creatorFromRequest, callback) {
        let creator = {
            name: creatorFromRequest.name,
            email: creatorFromRequest.email,
            dates: creatorFromRequest.dates,
            adminUUID: uuid(),
        }
        callback(creator);
    }
}


