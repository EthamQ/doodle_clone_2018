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

    // if property is model use setModelProperty of the corresponding model class to assign values
    setChildModelProperties(event, callback) {
        for (let key in event) {
            if (key == 'date') {
                this.saveDatesInDB(event[key], () =>{
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
        this.model.timestamp = new Date();
    }

    /**
     * 
     * @param dateArray array of dates sent by the client
     * 
     * @param callback function that returns an array of date objects
     * that should all be saved in the date collection in the database
     */
    saveDatesInDB(dateArray, callback) {
        dateArray.map(date => {
            let newDateId = uuid();
            let dateModel = new DateModel();
            dateModel.setModelProperty(date, ()=>{
                dateModel.setId(newDateId, ()=>{
                    dateModel.setUUID(this.model.uuid, ()=>{
                        dateModel.saveModelInDatabase();
                    });
                });
            });
            this.model.date.push({ date_id: newDateId });
        });
        callback();
    }

    // add one participant with isCreator: true to this model
    returnCreatorObject(creatorFromRequest, callback) {
        let creator = {
            name: creatorFromRequest.name,
            email: creatorFromRequest.email,
            creatorEventUUID: uuid()
        }
        callback(creator);
    }
}


