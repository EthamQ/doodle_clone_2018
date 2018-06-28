var mongodb = require('./../../MongoDB/dbUtils');
const uuid = require('uuid/v4');
var DoodleParticipantModel = require('./../../models/participant/doodleParticipantModel');
var ParticipantModel = require('./../../models/participant/doodleParticipantModel');
var ResponseBuilder = require('./../responseBuilder');

/**
 * returns all participants in the participants collection in a callback
 */
getAllParticipatesIntern = function (callback) {
    mongodb.getAllItems(mongodb.doodleParticipantDBInfo.dbName, mongodb.doodleParticipantDBInfo.collectionName).then(data => {
        if (data.success) {
            callback({ data: data.data, success: true });
        }
    }).catch(err => {
        callback({ data: null, success: false });
    });
}

/**
 * returns one participant object with the specified _id 
 * from the participants collection in a callback
 */
getParticipantById = function (partId, callback) {
    mongodb.getItemById(mongodb.doodleParticipantDBInfo.dbName, mongodb.doodleParticipantDBInfo.collectionName, partId).then(participant => {
        callback(participant);
    }).catch(err => {
        console.log(err);
        callback(null);
    })
}

getParticipantsByUUID = function (eventUUID, callback) {
    let participants = [];
    getAllParticipatesIntern(data => {
        if (data.success) {
            let partArray = data.data;
            partArray.map(p => {
                if (p.eventUUID === eventUUID) {
                    participants.push(p);
                }
            });
            callback({ data: participants, success: true });
        }
        else {
            callback({ data: null, success: false });
        }
    });
}

/**
 * looks for the event with 'eventUUID' and adds 'part_id'
 * to its participant array
 */
updateParticipantsInEventCollection = function (eventUUID, participant) {
    return new Promise((resolve, reject) => {
        participantModel = new ParticipantModel();
        participantModel.setId();
        participantModel.setModelProperty(participant, () => {
            getDoodleEventByUUID(eventUUID, eventData => {
                let participantsOld = eventData.event.participants;
                participantsOld.push(participantModel.getModel());
                let criteria = { uuid: eventUUID };
                let update = { participants: participantsOld };
                mongodb.updateItem(mongodb.doodleEventDBInfo.dbName, mongodb.doodleEventDBInfo.collectionName, criteria, update).then(data => {
                    let criteria2 = { uuid: eventUUID };
                    let update2 = { numberParticipants: (eventData.event.numberParticipants+1) };
                    mongodb.updateItem(mongodb.doodleEventDBInfo.dbName, mongodb.doodleEventDBInfo.collectionName, criteria2, update2).then(data => {
                        resolve();
                    });
                }).catch(err => {
                    reject(err);
                });
            });
        });
    });
}

/**
 * called by the router
 * adds participant to event collection and participant collection
 */
addParticipantToEvent = function (req, res, next) {
    let responseBuilder = new ResponseBuilder();
    let eventUUID = req.params.uuid;
    let participant = req.body;
    updateParticipantsInEventCollection(eventUUID, participant).then(data => {
                responseBuilder.setSuccess(true);
                responseBuilder.setMessage(responseBuilder.getParticipantAddedSuccessMsg());
                res.send(responseBuilder.getResponse());
    }).catch(err => {
        responseBuilder.setSuccess(false);
        responseBuilder.setMessage(responseBuilder.getDatabaseFailureMsg());
        res.send(responseBuilder.getResponse());
    });
}

/**
 * called by router
 * POST '/participant/remove/:eventUUID'
 * removes a participant with the corresponding
 * participantId from the event collection and the participant
 * collection
 */
removeParticipants = function (req, res, next) {
    let responseBuilder = new ResponseBuilder();
    let adminUUID = req.params.adminUUID;
    let participantsUpdated = req.body.participantsUpdated;
    getDoodleEventByCreatorUUID(adminUUID, data =>{
        if(data.success){
            if(participantsUpdated.length < data.event.participants.length){
                let criteria = { uuid: data.uuidEvent };
                let update = { participants: participantsUpdated };
                mongodb.updateItem(mongodb.doodleEventDBInfo.dbName,
                    mongodb.doodleEventDBInfo.collectionName,
                    criteria,
                    update).then(()=> {
                        responseBuilder.setSuccess(true);
                        responseBuilder.setMessage("participants removed updated");
                        res.send(responseBuilder.getResponse());
                    }).catch(err => {
                        responseBuilder.setSuccess(true);
                        responseBuilder.setMessage(responseBuilder.getDatabaseFailureMsg());
                        res.send(responseBuilder.getResponse());
                    });
            }
            else{
                responseBuilder.setSuccess(false);
                responseBuilder.setMessage("The length of the updatedParticipants has to be lesser than the initial array if you want to remove a participant");
                res.send(responseBuilder.getResponse());
                // no delete
            }
            
        }
        else{
            //  admin id not found
        }
    });
    // removeFromEventCollection(uuid, participantId).then(() => {
    //     removeFromParticipantCollection(participantId).then(() => {
    //         responseBuilder.setSuccess(true);
    //         responseBuilder.setMessage("participant was successfully removed");
    //         res.send(responseBuilder.getResponse());
    //     });
    // }).catch(err => {
    //     responseBuilder.setSuccess(false);
    //     responseBuilder.setMessage(responseBuilder.getDatabaseFailureMsg());
    //     res.send(responseBuilder.getResponse());
    // });
}

/**
 * removes participant from participant collection
 */
removeFromParticipantCollection = function (participantId) {
    return new Promise((resolve, reject) => {
        mongodb.deleteItemWithId(
            mongodb.doodleParticipantDBInfo.dbName,
            mongodb.doodleParticipantDBInfo.collectionName,
            participantId
        ).then(data => {
            resolve();
        }).catch(err => {
            reject(err);
        });
    });
}

/**
 * removes participant from event collection
 */
removeFromEventCollection = function (uuid, participantId) {
    return new Promise((resolve, reject) => {
        getDoodleEventByUUID(uuid, data => {
            let event = data.event;
            let participantsUpdated = event.participants;
            for (let i = 0; i < participantsUpdated.length; i++) {
                if (participantsUpdated[i].participantId == participantId) {
                    participantsUpdated.splice(i, 1);
                }
                break;
            }
            let criteria = { uuid: uuid };
            let update = { participants: participantsUpdated };
            mongodb.updateItem(mongodb.doodleEventDBInfo.dbName,
                mongodb.doodleEventDBInfo.collectionName,
                criteria,
                update).then(data => {
                    if (data.success) {
                        resolve();
                    }
                }).catch(err => {
                    reject(err);
                });
        });
    });
}

module.exports = {
    getAllParticipatesIntern: getAllParticipatesIntern,
    getParticipantById: getParticipantById,
    getParticipantsByUUID: getParticipantsByUUID,
    addParticipantToEvent: addParticipantToEvent,
    removeParticipants: removeParticipants
}