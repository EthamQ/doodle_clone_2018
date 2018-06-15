var doodleEventModel = require('./../models/doodleEventModel');
var mongodb = require('./../MongoDB/dbUtils');
var dbInfo = mongodb.doodleEventDBInfo;
var response = require('./responseBuilder');

exports.createNewDoodleEvent = function (req, res, next) {
    let responseBuilder = new response();
    let doodleEventToSave = new doodleEventModel();
    let newEvent = req.body;
        doodleEventToSave.setModelProperty(newEvent);
    doodleEventToSave.setDoodleEventModelUUID();
        let doodleEventReadyForDb = doodleEventToSave.getDoodleEventModel();
        console.log(doodleEventReadyForDb);
        mongodb.insertIntoCollection(dbInfo.dbName, dbInfo.collectionName, doodleEventReadyForDb).then(data => {
            responseBuilder.setMessage(data.success ? responseBuilder.getNewDoodleEventSuccessMsg() : responseBuilder.getNewDoodleEventFailureMsg());
            responseBuilder.setSuccess(data.success);
            res.send(responseBuilder.getResponse());
        });
}

exports.getDoodleEventByUUID = function (req, res, next) {
    let responseBuilder = new response();
    let uuidUrl = req.params.uuid;
    mongodb.getAllItems(dbInfo.dbName, dbInfo.collectionName).then(data => {
        responseBuilder.setSuccess(data.success);
        if (!data.success) {
            responseBuilder.setMessage(responseBuilder.getDatabaseFailureMsg());
        }
        else {
            responseBuilder.setMessage(responseBuilder.getDoodleEventByUUIDFailureMsg());
        }
        data.data.map(event => {
            if (event.uuid == uuidUrl) {
                responseBuilder.addData(event);
                responseBuilder.setMessage(responseBuilder.getDoodleEventByUUIDSuccessMsg());
                res.send(responseBuilder.getResponse());
            }
        });
    });
}