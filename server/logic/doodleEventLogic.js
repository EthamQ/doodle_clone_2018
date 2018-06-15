var DoodleEventModel = require('./../models/doodleEventModel');
var DoodleParticipantModel = require('./../models/doodleParticipantModel');
var Response = require('./responseBuilder');
var mongodb = require('./../MongoDB/dbUtils');
var dbInfo = mongodb.doodleEventDBInfo;


exports.createNewDoodleEvent = function (req, res, next) {
    let responseBuilder = new Response();
    let doodleEventToSave = new DoodleEventModel();
    let newEvent = req.body;
    doodleEventToSave.setValues(newEvent);
    doodleEventToSave.setDoodleEventModelUUID();
    let doodleEventReadyForDb = doodleEventToSave.getModel();
    console.log(doodleEventReadyForDb);
    mongodb.insertIntoCollection(dbInfo.dbName, dbInfo.collectionName, doodleEventReadyForDb).then(data => {
        responseBuilder.setMessage(data.success ? responseBuilder.getNewDoodleEventSuccessMsg() : responseBuilder.getNewDoodleEventFailureMsg());
        responseBuilder.setSuccess(data.success);
        res.send(responseBuilder.getResponse());
    });
}

exports.getDoodleEventByUUID = function (req, res, next) {
    let responseBuilder = new Response();
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


exports.addNewParticipant = function (req, res, next) {
    let uuid = req.params.uuid;
    let participant = new DoodleParticipantModel();
    let participantToAdd = req.body;
    participant.setModelProperty(participantToAdd);
    getDoodleEventByUUIDIntern(uuid, data => {
        let participantsOld = data.event.participants;
        participantsOld.push(participant.getModel());
        console.log(participantsOld);
        res.send(participantsOld);
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