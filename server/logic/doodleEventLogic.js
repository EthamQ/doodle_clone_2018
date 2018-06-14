var doodleEventModel = require('./../models/doodleEventModel');
var mongodb = require('./../MongoDB/dbUtils');
var dbInfo = mongodb.doodleEventDBInfo;


exports.createNewDoodleEvent = function(req, res, next) {
    let doodleEventToSave = new doodleEventModel();
    let newEvent = req.body;
    for (var key in newEvent) {
        doodleEventToSave.setDoodleEventModelProperty(key, newEvent[key]);
     }
     doodleEventToSave.setDoodleEventModelUUID();
     let doodleEventReadyForDb = doodleEventToSave.getDoodleEventModel();
     mongodb.insertIntoCollection(dbInfo.dbName, dbInfo.collectionName, doodleEventReadyForDb);
  };