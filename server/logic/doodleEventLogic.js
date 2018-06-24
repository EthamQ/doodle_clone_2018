var DoodleEventModel = require('./../models/event/doodleEventModel');
var DoodleParticipantModel = require('./../models/participant/doodleParticipantModel');
var ResponseBuilder = require('./responseBuilder');
var mongodb = require('./../MongoDB/dbUtils');
var dbInfo = mongodb.doodleEventDBInfo;
const uuid = require('uuid/v4');
let responseDataGetEvent = require('./responseBuilderGetEvent');
const participantLogic = require('./participantLogic.js');
const dateLogic = require('./dateLogic');


prepareNewDoodleEvent = function (req, res, next) {
    return new Promise((resolve, reject) => {
        let responseBuilder = new ResponseBuilder();
        let doodleEventToSave = new DoodleEventModel();
        let newEvent = req.body;
        responseDataGetEvent.initResponseData();
        doodleEventToSave.setResponseBuilder(responseBuilder);
        doodleEventToSave.generateAndSetRequiredProperties();
        doodleEventToSave.setModelProperty(newEvent, false);
        doodleEventToSave.setChildModelProperties(newEvent);
        resolve(doodleEventToSave);
    });
}

createNewDoodleEvent = function (req, res, next) {
    prepareNewDoodleEvent(req, res, next).then(doodleEventToSave => {
        doodleEventToSave.saveModelInDatabase();
        res.send(doodleEventToSave.getResponse());
    });
}

getDoodleEventDataByUUID = function (req, res, next) {
    return new Promise((resolve, reject) => {
        let uuidEvent = req.params.uuid;
        responseDataGetEvent.initResponseData();
        let responseBuilder = new ResponseBuilder();
        // look for event with event uuid
        responseDataGetEvent.addEventDataByUUID(uuidEvent, success => {
            responseBuilder.setSuccess(success);
            // event with uuid found
            if (success) {
                responseDataGetEvent.addParticipantsByUUID(uuidEvent, () =>{
                    responseDataGetEvent.addDatesByUUID(uuidEvent, ()=>{
                        responseDataGetEvent.setCreatorAccess(false);
                        responseBuilder.setMessage(responseBuilder.getDoodleEventByUUIDSuccessMsg());
                        resolve(responseBuilder);
                    });
                   
                });
                
            }
            // event with uuid not found
            else {
                // look if a creator has this uuid
                getDoodleEventByCreatorUUIDIntern(uuidEvent, data => {
                    if (data.success) {
                        responseDataGetEvent.addEventData(data.event);
                        responseDataGetEvent.addParticipantsByUUID(data.uuidEvent, () =>{
                            responseDataGetEvent.addDatesByUUID(data.uuidEvent, ()=>{
                                responseDataGetEvent.setCreatorAccess(true);
                                responseBuilder.setSuccess(true);
                                responseBuilder.setMessage(responseBuilder.getDoodleEventByUUIDSuccessMsg());
                                resolve(responseBuilder);
                            });
                        });
                    }
                    else {
                        responseBuilder.setSuccess(true);
                        responseBuilder.setMessage(responseBuilder.getDatabaseFailureMsg());
                        resolve(responseBuilder);
                    }
                });
            }
        });
    });
}

sendEventDataToClient = function (req, res, next) {
    getDoodleEventDataByUUID(req, res, next).then(responseBuilder => {
            responseBuilder.addData(responseDataGetEvent.getResponseData());
            res.send(responseBuilder.getResponse());
    });
}



// callback function returns the event and success boolean
getDoodleEventByUUIDIntern = function (uuidFromUrl, callback) {
    mongodb.getItemById(dbInfo.dbName, dbInfo.collectionName, uuidFromUrl).then(data => {
        if (data.data != null) {
            callback({ event: data.data, success: true });
        }
        else {
            callback({ event: null, success: false });
        }
    }).catch(err => {
        console.log(err);
        callback({ event: null, success: false });
    });
}

// callback function returns the event and success boolean
getDoodleEventByCreatorUUIDIntern = function (uuidFromUrl, callback) {
    mongodb.getAllItems(dbInfo.dbName, dbInfo.collectionName).then(data => {
        let arrayAllEvents = data.data;
        if (arrayAllEvents.length != 0) {
            arrayAllEvents.map(event => {
                if (event.creator.creatorEventUUID == uuidFromUrl) {
                    callback({ event: event, uuidEvent: event.uuid, success: true });
                }
            });
        }
        else {
            callback({ event: null, uuidEvent: null, success: false });
        }
    }).catch(err => {
        callback({ event: null, uuidEvent: null, success: false });
    });
}


















module.exports.getParticipantByUUID = getParticipantByUUID;
module.exports.getDatesByEventIdIntern = getDatesByEventIdIntern;
module.exports.getDoodleEventByUUIDIntern = getDoodleEventByUUIDIntern;




module.exports = {
    addDateToExistingParticipant: addDateToExistingParticipant,
    addParticipantToEvent: addParticipantToEvent,
    getDatesByEventIdIntern: getDatesByEventIdIntern,
    createNewDoodleEvent: createNewDoodleEvent,
    getDoodleEventByUUIDIntern: getDoodleEventByUUIDIntern,
    getAllParticipatesIntern: getAllParticipatesIntern,
    sendEventDataToClient: sendEventDataToClient,
}
