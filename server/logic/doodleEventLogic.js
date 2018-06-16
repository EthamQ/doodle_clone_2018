var DoodleEventModel = require('./../models/doodleEventModel');
var DoodleParticipantModel = require('./../models/doodleParticipantModel');
var ResponseBuilder = require('./responseBuilder');
var mongodb = require('./../MongoDB/dbUtils');
var dbInfo = mongodb.doodleEventDBInfo;


exports.createNewDoodleEvent = function (req, res, next) {
    let responseBuilder = new ResponseBuilder();
    let doodleEventToSave = new DoodleEventModel();
    let newEvent = req.body;
    doodleEventToSave.setValues(newEvent);
    doodleEventToSave.setDoodleEventModelUUID();
    let doodleEventReadyForDb = doodleEventToSave.getModel();
    console.log(doodleEventReadyForDb);
    mongodb.insertIntoCollection(dbInfo.dbName, dbInfo.collectionName, doodleEventReadyForDb).then(data => {
        responseBuilder.setMessage(data.success ? responseBuilder.getNewDoodleEventSuccessMsg() : responseBuilder.getNewDoodleEventFailureMsg());
        responseBuilder.setSuccess(data.success);
        responseBuilder.addData(doodleEventReadyForDb);
        res.send(responseBuilder.getResponse());
    });
}

exports.getDoodleEventByUUID = function (req, res, next) {
    let responseBuilder = new ResponseBuilder();
    let uuidUrl = req.params.uuid;
    getDoodleEventByUUIDIntern(uuidUrl, data => {
        responseBuilder.setSuccess(data.success);
        if (!data.success) {
            responseBuilder.setMessage(responseBuilder.getDatabaseFailureMsg());
        }
        else {
            responseBuilder.setMessage(responseBuilder.getDoodleEventByUUIDFailureMsg());
        }
        responseBuilder.addData(data.event);
        responseBuilder.setMessage(responseBuilder.getDoodleEventByUUIDSuccessMsg());
        res.send(responseBuilder.getResponse());
        resolve(responseBuilder.getResponse());
    });
}

// TODO: create response for client
exports.addNewParticipant = function (req, res, next) {
    let responseBuilder = new ResponseBuilder();
    let uuidFromUrl = req.params.uuid;
    let participant = new DoodleParticipantModel();
    let participantToAdd = req.body;
    participant.setModelProperty(participantToAdd);
    getDoodleEventByUUIDIntern(uuidFromUrl, data => {
        let participantsNew = data.event.participants;
        participantsNew.push(participant.getModel());
        console.log(participantsNew);
        let criteria = {uuid: uuidFromUrl};
        let update = {participants: participantsNew};
        mongodb.updateItem(dbInfo.dbName, dbInfo.collectionName, criteria, update);
        res.send(participantsNew);
    });
}

getDoodleEventByUUIDIntern = function (uuidFromUrl, callback) {
    mongodb.getAllItems(dbInfo.dbName, dbInfo.collectionName).then(data => {
        if (data.success) {
            data.data.map(event => {
                if (event.uuid == uuidFromUrl) {
                    callback({ event: event, success: data.success });
                }
            });
        }
    });
}