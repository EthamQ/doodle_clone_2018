var DoodleEventModel = require('./../models/event/doodleEventModel');
var DoodleParticipantModel = require('./../models/participant/doodleParticipantModel');
var ResponseBuilder = require('./responseBuilder');
var mongodb = require('./../MongoDB/dbUtils');
var dbInfo = mongodb.doodleEventDBInfo;
const uuid = require('uuid/v4');


exports.createNewDoodleEvent = function (req, res, next) {
    let responseBuilder = new ResponseBuilder();
    let doodleEventToSave = new DoodleEventModel();
    let newEvent = req.body;
    doodleEventToSave.setResponseBuilder(responseBuilder);
    doodleEventToSave.generateAndSetRequiredProperties();
    doodleEventToSave.setModelProperty(newEvent, false);
    doodleEventToSave.setChildModelProperties(newEvent);
        setTimeout(()=>{
            doodleEventToSave.saveModelInDatabase();
            res.send(doodleEventToSave.getResponse());
        }, 2000);
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
    participant.setModelProperty(participantToAdd, false);
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

// callback function returns the event and success boolean
getAllDatesIntern = function (callback) {
    console.log("alldates");
    mongodb.getAllItems(mongodb.doodleDateDBInfo.dbName, mongodb.doodleDateDBInfo.collectionName).then(data => {
        if (data.success) {
                    callback({data});
        }
    });
}

getDatesByEventIdIntern = function (eventId, callback) {
    console.log("alldates");
    mongodb.getAllItems(mongodb.doodleDateDBInfo.dbName, mongodb.doodleDateDBInfo.collectionName).then(data => {
        if (data.success) {
            // console.log(data.data);
            let eventsWithEventId = data.data.filter(el => el.uuid == eventId);
            callback(eventsWithEventId);
        }
    });
}


exports.addPart = function(req, res, next){
    return new Promise((resolve, reject) =>{
        let eventUUID;
        let dateId = req.body.dateId;
        console.log(dateId);
        getAllDatesIntern(data => {
            data.data.data.map(date =>{
                if(date._id === dateId){
                    eventUUID = date.uuid;
                    resolve({eventUUID: eventUUID, dateId: dateId, dates: data.data.data});
                }
            });
        });
    });
  

}

exports.addDatesToPart = function(req, res, next){
    return new Promise((resolve, reject)=>{
        let part = [];
        this.addPart(req, res, next).then(data =>{
            data.dates.map(el =>{
                if(el.uuid = data.eventUUID){
                    if(el._id == data.dateId){
                        part.push({dateId: dateId, takesPart: true});
                    }
                    else{
                        part.push({dateId: dateId, takesPart: false});
                    }
                }
            });
        });
    });
    
}

exports.addDatesToParti = function(req, res, next){
    let eventUUID = req.body.eventId;
    let participantId;
}

exports.addOnlyParticipant = function(req, res, next){
    let eventUUID = req.params.uuid;
    let participant = req.body;
    let dates = [];
  
    getDatesByEventIdIntern(eventUUID, data =>{
        console.log(data);
        data.map(el =>{
            dates.push({dateId: el._id, participates: false});
        });
        newParticipant = {_id: uuid(),eventUUID: eventUUID, name: participant.name, email: participant.email, dates: dates};
        mongodb.insertIntoCollection(mongodb.doodleParticipantDBInfo.dbName, mongodb.doodleParticipantDBInfo.collectionName, newParticipant);
    });
   
}