const eventLogic = require('./eventLogic');
const DoodleEventModel = require('./../../models/event/eventModel');
const DoodleParticipantModel = require('./../../models/participant/participantModel');
const ResponseBuilder = require('./../responseBuilder');
const mongodb = require('./../../MongoDB/dbUtils');
const dbInfo = mongodb.doodleEventDBInfo;
const uuid = require('uuid/v4');
const participantLogic = require('./../participant/participantLogic');
const dateLogic = require('./../date/dateLogic');

/**
 * called by the router
 * POST '/event/new'
 * receives a DoodleEventModel() object, saves it in the database
 * and creates a response for the client
 */
saveNewDoodleEvent = function (req, res, next) {
    let responseBuilder = new ResponseBuilder();
    prepareNewDoodleEvent(req, res, next).then(doodleEventToSave => {
        if (doodleEventToSave.modelIsValid() && doodleEventToSave.childModelsAreValid()) {
            doodleEventToSave.saveModelInDatabase().then(data => {
                responseBuilder.addMessage(responseBuilder.getNewDoodleEventSuccessMsg());
                responseBuilder.addData(data.savedItem);
                responseBuilder.setSuccess(true);
                res.send(responseBuilder.getResponse());
            }).catch(err => {
                responseBuilder.setSuccess(false);
                responseBuilder.addMessage(responseBuilder.getNewDoodleEventFailureMsg());
                res.send(responseBuilder.getResponse());
            });
        }
        else {
            // model not valid
            let errMsg = "Required values are missing";
            if(!doodleEventToSave.childModelsAreValid()){
                errMsg = "You have to add at least one date";
            }
            responseBuilder.setSuccess(false);
            responseBuilder.addMessage(errMsg);
            res.send(responseBuilder.getResponse());
        }
    });
}

/**
 * called by the router
 * POST '/event/update/:creatorUUID'
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
                responseBuilder.addMessage("Event successfully updated");
                res.send(responseBuilder.getResponse());
            }).catch(err => {
                console.log(err);
                responseBuilder.setSuccess(false);
                responseBuilder.addMessage(responseBuilder.getDatabaseFailureMsg());
                res.send(responseBuilder.getResponse());
            });
        }
        else {
            responseBuilder.setSuccess(false);
            responseBuilder.addMessage(responseBuilder.getDoodleEventByUUIDFailureMsg());
            res.send(responseBuilder.getResponse());
        }
    });
}

/**
 * called by the router
 * GET '/event/:uuid'
 * sends the event with the uuid to the client
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
            responseBuilder.addMessage(responseBuilder.getDoodleEventByUUIDSuccessMsg());
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
                    responseBuilder.addMessage(responseBuilder.getDoodleEventByUUIDSuccessMsg() + ", admin access");
                    responseBuilder.addData(data.event);
                    res.send(responseBuilder.getResponse());
                }
                else {
                    // failure when reading the database
                    responseBuilder.setSuccess(false);
                    responseBuilder.addMessage(responseBuilder.getDatabaseFailureMsg());
                    res.send(responseBuilder.getResponse());
                }
            });
        }
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
                    responseBuilder.addMessage("Event successfully removed");
                    res.send(responseBuilder.getResponse());

                }).catch(err => {
                    console.log(err);
                    responseBuilder.setSuccess(false);
                    responseBuilder.addMessage(responseBuilder.getDatabaseFailureMsg());
                    res.send(responseBuilder.getResponse());
                });
        }
        else {
            responseBuilder.setSuccess(false);
            responseBuilder.addMessage("Event with this creator uuid not found");
            res.send(responseBuilder.getResponse());
        }
    });
}

module.exports = {
    saveNewDoodleEvent: saveNewDoodleEvent,
    updateDoodleEvent: updateDoodleEvent,
    getDoodleEventDataByUUID: getDoodleEventDataByUUID,
    deleteEvent: deleteEvent,
}