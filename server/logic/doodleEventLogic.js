var DoodleEventModel = require('./../models/event/doodleEventModel');
var DoodleParticipantModel = require('./../models/participant/doodleParticipantModel');
var ResponseBuilder = require('./responseBuilder');
var mongodb = require('./../MongoDB/dbUtils');
var dbInfo = mongodb.doodleEventDBInfo;


exports.createNewDoodleEvent = function (req, res, next) {
    let responseBuilder = new ResponseBuilder();
    doodleEventToSave = new DoodleEventModel();
    let newEvent = req.body;
    doodleEventToSave.setThisAndChildModels(newEvent);
    if (doodleEventToSave.modelIsValid() && doodleEventToSave.childModelsAreValid()) {
        let doodleEventReadyForDb = doodleEventToSave.getModel();
        mongodb.insertIntoCollection(dbInfo.dbName, dbInfo.collectionName, doodleEventReadyForDb).then(data => {
            responseBuilder.setMessage(data.success ? responseBuilder.getNewDoodleEventSuccessMsg() : responseBuilder.getNewDoodleEventFailureMsg());
            responseBuilder.setSuccess(data.success);
            responseBuilder.addData(doodleEventReadyForDb);
            res.send(responseBuilder.getResponse());
        }).catch(function (err) {
            responseBuilder.setSuccess(false);
            responseBuilder.setMessage(responseBuilder.getNewDoodleEventFailureMsg());
            res.send(responseBuilder.getResponse());
        });
    }
    else {
        responseBuilder.setSuccess(false);
        responseBuilder.setMessage(responseBuilder.getModelIsInvalidFailureMsg());
        res.send(responseBuilder.getResponse());
    }

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
    });
}

// reads uuid from url, gets the corresponding event, 
// adds the participant from the requestbody to the participants array of the event
exports.addNewParticipant = function (req, res, next) {
    let responseBuilder = new ResponseBuilder();
    let uuidFromUrl = req.params.uuid;
    let participant = new DoodleParticipantModel();
    let participantToAdd = req.body;
    participant.setModelProperty(participantToAdd);
    getDoodleEventByUUIDIntern(uuidFromUrl, data => {
        let participantsNew = data.event.participants;
        participantsNew.push(participant.getModel());
        let criteria = { uuid: uuidFromUrl };
        let update = { participants: participantsNew };
        mongodb.updateItem(dbInfo.dbName, dbInfo.collectionName, criteria, update).then(dbdata => {
            responseBuilder.setSuccess(dbdata.success);
            responseBuilder.addData(participantsNew);
            responseBuilder.setMessage(dbdata.success ? responseBuilder.getParticipantAddedSuccessMsg(data.event.title) : responseBuilder.getDatabaseFailureMsg());
            res.send(responseBuilder.getResponse());
        }).catch(function (err) {
            responseBuilder.setSuccess(false);
            responseBuilder.setMessage(responseBuilder.getDatabaseFailureMsg());
            res.send(responseBuilder.getResponse());
        });
    });
}

// callback function returns the event and success boolean
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