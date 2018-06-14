var doodleEventModel = require('./../models/doodleEventModel');
var mongodb = require('./../MongoDB/dbUtils');
var dbInfo = mongodb.doodleEventDBInfo;
var response = require('./responseBuilder');

exports.createNewDoodleEvent = function(req, res, next) {
    let responseBuilder = new response();
    let doodleEventToSave = new doodleEventModel();
    let newEvent = req.body;
    for (var key in newEvent) {
        doodleEventToSave.setDoodleEventModelProperty(key, newEvent[key]);
     }
     doodleEventToSave.setDoodleEventModelUUID();
     let doodleEventReadyForDb = doodleEventToSave.getDoodleEventModel();
     mongodb.insertIntoCollection(dbInfo.dbName, dbInfo.collectionName, doodleEventReadyForDb).then(success =>{
        if(success){
            responseBuilder.setMessage(responseBuilder.getNewDoodleEventSuccessMsg());
        }
        else{
            responseBuilder.setMessage(responseBuilder.getNewDoodleEventFailureMsg());
        }
        responseBuilder.setSuccess(success);
        res.send(responseBuilder.getResponse());
     }); 
  };