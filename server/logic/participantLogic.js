var mongodb = require('./../MongoDB/dbUtils');
const uuid = require('uuid/v4');
var DoodleParticipantModel = require('./../models/participant/doodleParticipantModel');
var ResponseBuilder = require('./responseBuilder');

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


getNumberOfParticipants = function (uuid, callback) {
    getDoodleEventByUUID(uuid, data => {
        callback(data.event.numberParticipants);
    });
}

incrementNumberParticipants = function (uuid) {
    return new Promise((resolve, reject) =>{
 getNumberOfParticipants(uuid, number => {
        let criteria = { uuid: uuid };
        let update = { numberParticipants: (number + 1) };
        mongodb.updateItem(mongodb.doodleEventDBInfo.dbName, mongodb.doodleEventDBInfo.collectionName, criteria, update).then(data => {
            resolve(data);
        }).catch(err => {
            reject(err);
        });
    });
    });
}

/**
 * look for event with 'eventUUID', add its dates to the participant
 * save the participant with its part_id to the participants collection
 */
addParticipantToParticipantCollection = function(eventUUID, participant, part_id){
    return new Promise((resolve,reject)=>{
    getDatesByEventId(eventUUID, dateArray => {
        let participantModel = new DoodleParticipantModel();
        participantModel.setDates(dateArray).then(() => {
            participantModel.setModelProperty(participant, () => {
                participantModel.setId(part_id, () => {
                    participantModel.setUUID(eventUUID, () => {
                        mongodb.insertIntoCollection(
                            mongodb.doodleParticipantDBInfo.dbName,
                            mongodb.doodleParticipantDBInfo.collectionName,
                            participantModel.getModel()
                        ).then(data =>{
                            if(data.success){
                                resolve({success: true});
                            }
                        }).catch(err =>{
                            reject(err);
                        });
                    })
                })
            });
        });
    });
    });
}

/**
 * looks for the event with 'eventUUID' and adds 'part_id'
 * to its participant array
 */
updateParticipantsInEventCollection = function(eventUUID, part_id){
    return new Promise((resolve,reject)=>{
    getDoodleEventByUUID(eventUUID, data => {
        let participantsOld = data.event.participants;
        // add the new id to the array
        participantsOld.push({ participantId: part_id });
        let criteria = { uuid: eventUUID };
        let update = { participants: participantsOld };
        mongodb.updateItem(mongodb.doodleEventDBInfo.dbName, mongodb.doodleEventDBInfo.collectionName, criteria, update).then(data => {
            if (data.success) {
                resolve({success: true});
            }
        }).catch(err =>{
            reject(err);
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
    let dates = [];
    let part_id = uuid();
    addParticipantToParticipantCollection(eventUUID, participant, part_id).then(data =>{
        updateParticipantsInEventCollection(eventUUID, part_id).then(data =>{
            incrementNumberParticipants(eventUUID).then(data =>{
                if(data.success){
                    responseBuilder.setSuccess(true);
                    responseBuilder.setMessage(responseBuilder.getParticipantAddedSuccessMsg());
                    res.send(responseBuilder.getResponse());
                }
            }).catch(err =>{
                responseBuilder.setSuccess(false);
                res.send(responseBuilder.getResponse());
            });
        }).catch(err =>{
            responseBuilder.setSuccess(false);
            res.send(responseBuilder.getResponse());
        });
    }).catch(err =>{
        responseBuilder.setSuccess(false);
        res.send(responseBuilder.getResponse());
    });
}

module.exports = {
    getAllParticipatesIntern: getAllParticipatesIntern,
    getParticipantById: getParticipantById,
    getParticipantsByUUID: getParticipantsByUUID,
    incrementNumberParticipants: incrementNumberParticipants,
    getNumberOfParticipants: getNumberOfParticipants,
    addParticipantToEvent: addParticipantToEvent
}