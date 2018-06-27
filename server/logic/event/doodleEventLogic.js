var DoodleEventModel = require('./../../models/event/doodleEventModel');
var DoodleParticipantModel = require('./../../models/participant/doodleParticipantModel');
var ResponseBuilder = require('./../responseBuilder');
var mongodb = require('./../../MongoDB/dbUtils');
var dbInfo = mongodb.doodleEventDBInfo;
const uuid = require('uuid/v4');
let responseDataGetEvent = require('./responseBuilderGetEvent');
const participantLogic = require('./../participant/participantLogic');
const dateLogic = require('./../date/dateLogic');

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
        if (doodleEventToSave.modelIsValid()) {
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
        }
        else {
            // model not valid
            responseBuilder.setSuccess(false);
            responseBuilder.setMessage("Required values are missing");
            res.send(responseBuilder.getResponse());
        }
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
            let criteria = { uuid: data.uuidEvent };
            let update = {
                title: req.body.title,
                location: req.body.location,
                description: req.body.description,
                eventType: req.body.eventType,
            }
            mongodb.updateItem(mongodb.doodleEventDBInfo.dbName, mongodb.doodleEventDBInfo.collectionName, criteria, update).then(data => {
                responseBuilder.setSuccess(true);
                responseBuilder.setMessage("Event successfully updated");
                res.send(responseBuilder.getResponse());
            }).catch(err => {
                console.log(err);
                responseBuilder.setSuccess(false);
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
 * called by the router
 */
getDoodleEventDataByUUID = function (req, res, next) {
    let uuidEvent = req.params.uuid;
    let responseBuilder = new ResponseBuilder();
    // look for event with event uuid
    getDoodleEventByUUID(uuidEvent, data => {
        // event with uuid found
        if (data.success) {
            data.event.adminAccess = false;
            delete data.event.creator.adminUUID;
            delete data.event._id;
            responseBuilder.setSuccess(true);
            responseBuilder.setMessage(responseBuilder.getDoodleEventByUUIDSuccessMsg());
            responseBuilder.addData(data.event);
            res.send(responseBuilder.getResponse());
        }
        // event with uuid not found
        else {
            // look if a creator has this uuid
            getDoodleEventByCreatorUUID(uuidEvent, data => {
                if (data.success) {
                    // event with creator uuid found
                    data.event.adminAccess = true;
                    delete data.event._id;
                    responseBuilder.setSuccess(true);
                    responseBuilder.setMessage(responseBuilder.getDoodleEventByUUIDSuccessMsg() + ", admin access");
                    responseBuilder.addData(data.event);
                    res.send(responseBuilder.getResponse());

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
}


/**
 * looks for the event with uuid = 'uuidEvent'
 * returns the { event: event, success: true } in a callback on success
 * { event: null, success: false } in a callback on failure
 */
getDoodleEventByUUID = function (uuidEvent, callback) {
    mongodb.getItemById(dbInfo.dbName, dbInfo.collectionName, uuidEvent).then(data => {
        console.log(data);
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
        // console.log(data.data[0].creator);
        if (arrayAllEvents.length != 0) {
            // look for creator uuid in event
            for (let i = 0; i < arrayAllEvents.length; i++) {
                console.log(arrayAllEvents[i].creator.adminUUID);
                console.log(uuidCreator);
                if (arrayAllEvents[i].creator.adminUUID == uuidCreator) {
                    console.log("creatorid found");
                    callback({ event: arrayAllEvents[i], uuidEvent: arrayAllEvents[i].uuid, success: true });
                    break;
                }
                // creator id not found, end of array
                else {
                    if (i === (arrayAllEvents.length - 1)) {
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

/**
 * called by router
 * POST '/event/delete/:creatorUUID'
 * deletes an event with the creator id in the event collection
 * then deletes the corresponding dates and participants
 * in the date and participant collection
 */
deleteEvent = function (req, res, next) {
    let responseBuilder = new ResponseBuilder();
    let creatorUUID = req.params.creatorUUID;
    getDoodleEventByCreatorUUID(creatorUUID, data => {
        if (data.success) {
            let event = data.event;
            let uuid = event.uuid;
            // delete event
            mongodb.deleteItemWithId(
                mongodb.doodleEventDBInfo.dbName,
                mongodb.doodleEventDBInfo.collectionName,
                uuid).then(() => {
                            responseBuilder.setSuccess(true);
                            responseBuilder.setMessage("Event successfully removed");
                            res.send(responseBuilder.getResponse());

                }).catch(err => {
                    console.log(err);
                    responseBuilder.setSuccess(false);
                    responseBuilder.setMessage(responseBuilder.getDatabaseFailureMsg());
                    res.send(responseBuilder.getResponse());
                });
        }
        else {
            responseBuilder.setSuccess(false);
            responseBuilder.setMessage("Event with this creator uuid not found");
            res.send(responseBuilder.getResponse());
        }
    });
}



module.exports.getParticipantsByUUID = getParticipantsByUUID;
module.exports.getDatesByEventId = getDatesByEventId;
module.exports.getDoodleEventByUUID = getDoodleEventByUUID;
module.exports = {
    addParticipantToEvent: addParticipantToEvent,
    getDatesByEventId: getDatesByEventId,
    saveNewDoodleEvent: saveNewDoodleEvent,
    getDoodleEventByUUID: getDoodleEventByUUID,
    getAllParticipatesIntern: getAllParticipatesIntern,
    getDoodleEventDataByUUID: getDoodleEventDataByUUID,
    updateDoodleEvent: updateDoodleEvent,
    getDoodleEventByCreatorUUID: getDoodleEventByCreatorUUID,
    deleteEvent: deleteEvent,
}
