var DoodleEventModel = require('./../models/event/doodleEventModel');
var DoodleParticipantModel = require('./../models/participant/doodleParticipantModel');
var ResponseBuilder = require('./responseBuilder');
var mongodb = require('./../MongoDB/dbUtils');
var dbInfo = mongodb.doodleEventDBInfo;
const uuid = require('uuid/v4');
let responseDataGetEvent = require('./responseBuilderGetEvent');
const participantLogic = require('./participantLogic.js');
const dateLogic = require('./dateLogic');

/**
 * creates DoodleEventModel() object, fills its values with the values
 * of the request data and then resolves the model object in a promise
 */
prepareNewDoodleEvent = function (req, res, next) {
    return new Promise((resolve, reject) => {
        let doodleEventToSave = new DoodleEventModel();
        let newEvent = req.body;
        doodleEventToSave.generateAndSetRequiredProperties();
        doodleEventToSave.setModelProperty(newEvent, () => {
            doodleEventToSave.setChildModelProperties(newEvent, () => {
                resolve(doodleEventToSave);
            });
        });
    });
}

/**
 * called by the router
 * receives a DoodleEventModel() object, saves it in the database
 * and creates a response for the client
 */
saveNewDoodleEvent = function (req, res, next) {
    let responseBuilder = new ResponseBuilder();
    // get DoodleEventModel() with set values
    prepareNewDoodleEvent(req, res, next).then(doodleEventToSave => {
        // save it in DB
        doodleEventToSave.saveModelInDatabase().then(data => {
            // set values for response to client
            if (data.success) {
                responseBuilder.setMessage(responseBuilder.getNewDoodleEventSuccessMsg());
                responseBuilder.addData(data.savedItem);
            }
            else {
                responseBuilder.setMessage(responseBuilder.getNewDoodleEventFailureMsg());
            }
            responseBuilder.setSuccess(data.success);
            res.send(responseBuilder.getResponse());
        }).catch(err => {
            responseBuilder.setSuccess(false);
            responseBuilder.setMessage(responseBuilder.getNewDoodleEventFailureMsg());
            res.send(responseBuilder.getResponse());
        });

    });
}

/**
 * update title, description, eventType, location of an event
 */
updateDoodleEvent = function (req, res, next) {
    let responseBuilder = new ResponseBuilder();
    creatorUUID = req.params.creatorUUID;
    getDoodleEventByCreatorUUID(creatorUUID, data => {
        if (data.success) {
            responseBuilder.setSuccess(true);
            responseBuilder.setMessage("Event successfully updated");
            let criteria = { uuid: data.uuidEvent };
            let update = {
                title: req.body.title,
                location: req.body.location,
                description: req.body.description,
                eventType: req.body.eventType,
            }
            mongodb.updateItem(mongodb.doodleEventDBInfo.dbName, mongodb.doodleEventDBInfo.collectionName, criteria, update).then(data => {
                res.send(responseBuilder.getResponse());
            }).catch(err => {
                responseBuilder.setMessage(responseBuilder.getDatabaseFailureMsg());
                res.send(responseBuilder.getResponse());
            });

        }
        else {
            responseBuilder.setSuccess(false);
            responseBuilder.setMessage(responseBuilder.getDoodleEventByUUIDFailureMsg());
            res.send(responseBuilder.getResponse());
        }
    });
}

/**
 * stores data about the event with the corresponding uuid in
 * responseDataGetEvent.js to send it in sendEventDataToClient()
 * resolves an instance of responseBuilder with set success and message
 */
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
                responseDataGetEvent.addParticipantsByUUID(uuidEvent, () => {
                    responseDataGetEvent.addDatesByUUID(uuidEvent, () => {
                        responseDataGetEvent.setCreatorAccess(false);
                        responseBuilder.setMessage(responseBuilder.getDoodleEventByUUIDSuccessMsg());
                        resolve(responseBuilder);
                    });
                });
            }
            // event with uuid not found
            else {
                // look if a creator has this uuid
                getDoodleEventByCreatorUUID(uuidEvent, data => {
                    if (data.success) {
                        // event with creator uuid found
                        responseDataGetEvent.addEventData(data.event);
                        responseDataGetEvent.addParticipantsByUUID(data.uuidEvent, pData => {
                            responseDataGetEvent.addDatesByUUID(data.uuidEvent, () => {
                                if (pData.success) {
                                    responseDataGetEvent.setCreatorAccess(true);
                                    responseBuilder.setSuccess(true);
                                    responseBuilder.setMessage(responseBuilder.getDoodleEventByCreatorUUIDSuccessMsg());
                                    resolve(responseBuilder);
                                }
                                // event with creator uuid not found, uuid doesn't exist
                                else {
                                    responseBuilder.setSuccess(false);
                                    responseBuilder.setMessage(responseBuilder.getDoodleEventByUUIDFailureMsg());
                                    resolve(responseBuilder);
                                }
                            });
                        });
                    }
                    else {
                        // failure when reading the database
                        responseBuilder.setSuccess(false);
                        responseBuilder.setMessage(responseBuilder.getDatabaseFailureMsg());
                        resolve(responseBuilder);
                    }
                });
            }
        });
    });
}

/**
 * called by the router
 * adds data generated by getDoodleEventDataByUUID() to the responseBuilder
 * and sends it to the client
 */
sendEventDataToClient = function (req, res, next) {
    getDoodleEventDataByUUID(req, res, next).then(responseBuilder => {
        responseBuilder.addData(responseDataGetEvent.getResponseData());
        res.send(responseBuilder.getResponse());
    });
}

/**
 * looks for the event with uuid = 'uuidEvent'
 * returns the { event: event, success: true } in a callback on success
 * { event: null, success: false } in a callback on failure
 */
getDoodleEventByUUID = function (uuidEvent, callback) {
    mongodb.getItemById(dbInfo.dbName, dbInfo.collectionName, uuidEvent).then(data => {
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

/**
 * looks for the event with creatorUUID = 'uuidCreator'
 * on success: returns { event: event, uuidEvent: event.uuid, success: true } in a callback
 * on failure: returns { event: null, uuidEvent: null, success: false } in a callback
 */
getDoodleEventByCreatorUUID = function (uuidCreator, callback) {
    console.log("inside getDoodleEventByCreatorUUID");
    mongodb.getAllItems(dbInfo.dbName, dbInfo.collectionName).then(data => {
        let arrayAllEvents = data.data;
        if (arrayAllEvents.length != 0) {
            // look for creator uuid in event
            for(let i = 0; i < arrayAllEvents.length; i++ ){
                if (arrayAllEvents[i].creator.creatorEventUUID == uuidCreator) {
                    console.log("creatorid found");
                    callback({ event: arrayAllEvents[i], uuidEvent: arrayAllEvents[i].uuid, success: true });
                }
                // creator id not found, end of array
                else{
                    if(i === (arrayAllEvents.length)){
                        console.log("creatorid not found");
                        callback({ event: null, uuidEvent: null, success: false });
                    }
                }
                
            }
        }
    
    }).catch(err => {
        console.log(err);
        callback({ event: null, uuidEvent: null, success: false });
    });
}


module.exports.getParticipantsByUUID = getParticipantsByUUID;
module.exports.getDatesByEventId = getDatesByEventId;
module.exports.getDoodleEventByUUID = getDoodleEventByUUID;
module.exports = {
    addDateToExistingParticipant: addDateToExistingParticipant,
    addParticipantToEvent: addParticipantToEvent,
    getDatesByEventId: getDatesByEventId,
    saveNewDoodleEvent: saveNewDoodleEvent,
    getDoodleEventByUUID: getDoodleEventByUUID,
    getAllParticipatesIntern: getAllParticipatesIntern,
    sendEventDataToClient: sendEventDataToClient,
    updateDoodleEvent: updateDoodleEvent,
    getDoodleEventByCreatorUUID: getDoodleEventByCreatorUUID,
}
