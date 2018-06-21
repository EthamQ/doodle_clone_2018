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
            constructorArgs.model,
            constructorArgs.allowedKeys,
            constructorArgs.requiredKeys,
            constructorArgs.dbInfo
        );
        this.model.dates = [];
        this.datesAreValid = true;
        this.tempdates = [];
    }

    // set properties of this model directly
    // if property is model use setModelProperty of the corresponding model class to assign values
    setChildModelProperties(event) {
        // other models in this model
        // for (let key in event) {
        //     switch(key){
        //         case 'date': this.addDates(event[key]);
        //         break;
        //         // case 'participants': this.addCreator(event[key]);
        //         // break;
        //     }

        for (let key in event) {
            if (key == 'date') {
                event[key].map(el =>{
                    let id = uuid();
                    let date = {_id: id, date: el.date, timeFrom: el.timeFrom, timeTo: el.timeTo, uuid: this.model.uuid};
                    this.model.date.push({date_id: id});
                    dbUtils.insertIntoCollection(dbUtils.doodleDateDBInfo.dbName, dbUtils.doodleDateDBInfo.collectionName, date);
                });
            }
            if (key == 'creator') {
                this.model.creator = {name: event[key].name, email: event[key].email, uuid: uuid()};
            }
        }
    }

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
        this.setDoodleEventModelUUID();
        this.setTimestamp();
        return this.model;
    }

    setTimestamp() {
        this.model.timestamp = new Date().toJSON();
    }

    // add all dates in 'dateArray' to this EventModel


    addtotempdates(data) {
        return new Promise((resolve, reject) => {
            this.tempdates.push(data);
        });

    }

    addDates(date) {
        return new Promise((resolve, reject) => {
            let dateModel = new DateModel();
            dateModel.setId(uuid());
            dateModel.setModelProperty(date, true);
            dateModel.setUUID(this.model.uuid);
            resolve(dateModel);
            // console.log(dateModel);
            // console.log(date);
            // console.log(dateModel.getModel());
            // dateModel.saveModelInDatabase().then(data =>{
            //     //    console.log(data);
            //        this.model.date.push(data.insertedId);
            //    });


            // if(this.datesAreValid){
            //     this.datesAreValid = dateModel.modelIsValid();
            // }
        });


    }

    save(dateModel) {
        console.log(dateModel);
        dateModel.saveModelInDatabase().then(data => {
            this.model.date.push('ff');
        });
    }

    // add one participant with isCreator: true to this model
    addCreator(creator) {
        if (participantArray.length === 1) {

                let participant = new ParticipantModel();
                participant.setIsEventCreator();
                participant.setModelProperty(creator, false);
                this.model.creator = participant.getModel();
                this.model.numberParticipants++;
        }
        else {
            console.log("throw error, more than one creator or no creator!");
        }
    }


}


