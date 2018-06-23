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
    let uuidUrl = req.params.uuid;
    getDatesByEventIdIntern(uuidUrl, dateArray => {
        getParticipantByUUID(uuidUrl, partArray =>{
            // console.log(dateArray);
            // console.log(partArray);
            let responseBuilder = new ResponseBuilder();
            console.log("now start get doodle event normal");
            getDoodleEventByUUIDIntern(uuidUrl, data => {
                console.log("geteventbyuuid success?: " + data.success);
                responseBuilder.setSuccess(data.success);
                if (data.success) {
                    console.log("normal access to event");
                    data.event.date = dateArray;
                    data.event.participants = partArray;
                    responseBuilder.addData(data.event);
                    responseBuilder.addData({creatorAccess: false});
                    responseBuilder.setMessage(responseBuilder.getDoodleEventByUUIDSuccessMsg());
                    res.send(responseBuilder.getResponse());
                }
                 // look for creator id
                else {
                    console.log("now look for creator: ");
                    getDoodleEventByCreatorUUIDIntern(uuidUrl, data =>{
                        console.log(data);
                        if(data.success){
                            console.log("creator access to event");
                            data.event.date = dateArray;
                            data.event.participants = partArray;
                            responseBuilder.addData(data.event);
                            responseBuilder.addData({creatorAccess: true});
                            responseBuilder.setMessage(responseBuilder.getDoodleEventByUUIDSuccessMsg());
                            res.send(responseBuilder.getResponse());
                        }
                        else{
                            responseBuilder.setMessage(responseBuilder.getDatabaseFailureMsg());
                            res.send(responseBuilder.getResponse());
                        }
                    });
                }
               
            });
        });
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
    console.log("now inside get doodle event normal");
    mongodb.getAllItems(dbInfo.dbName, dbInfo.collectionName).then(data => {
        if (data.success) {
            data.data.map(event => {
                if (event.uuid == uuidFromUrl) {
                    console.log(event);
                    callback({ event: event, success: data.success });
                }
            });
            callback({ event: null, success: false });
        }
        else{
            callback({ event: null, success: data.success });
        }
    });
}

// callback function returns the event and success boolean
getDoodleEventByCreatorUUIDIntern = function (uuidFromUrl, callback) {
    console.log("now in creatoruuid function with uuid: " + uuidFromUrl);
    mongodb.getAllItems(dbInfo.dbName, dbInfo.collectionName).then(data => {
        // console.log(data);
        if (data.success) {
            data.data.map(event => {
                console.log(event.creator);
                if (event.creator.creatorEventUUID == uuidFromUrl) {
                    console.log("found");
                    callback({ event: event, success: data.success });
                }
            });
        }
    });
}

// callback function returns the event and success boolean
getAllDatesIntern = function (callback) {
    // console.log("alldates");
    mongodb.getAllItems(mongodb.doodleDateDBInfo.dbName, mongodb.doodleDateDBInfo.collectionName).then(data => {
        if (data.success) {
                    callback({data});
        }
    });
}

getDatesByEventIdIntern = function (eventId, callback) {
    // console.log("alldates");
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
        // console.log(dateId);
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

exports.addParticipantToEvent = function(req, res, next){
    let eventUUID = req.params.uuid;
    let participant = req.body;
    let dates = [];
    let part_id = uuid();
  
    getDatesByEventIdIntern(eventUUID, data =>{
        // console.log(data);
        data.map(el =>{
            dates.push({dateId: el._id, participates: false});
        });
        newParticipant = {_id: part_id,eventUUID: eventUUID, name: participant.name, email: participant.email, dates: dates};
        mongodb.insertIntoCollection(mongodb.doodleParticipantDBInfo.dbName, mongodb.doodleParticipantDBInfo.collectionName, newParticipant);
    });

    getDoodleEventByUUIDIntern(eventUUID, data =>{
        let participantsOld = data.event.participants;
        console.log(data.participants);
        participantsOld.push({participantId: part_id});
        let criteria = {uuid: eventUUID};
        let update = {participants: participantsOld};
        mongodb.updateItem(mongodb.doodleEventDBInfo.dbName, mongodb.doodleEventDBInfo.collectionName, criteria, update);
    });

    // // TODO: add partId to event
    // getDoodleEventByUUIDIntern(eventUUID, data => {
    //     // console.log(data.event);
    // });

    incrementNumberParticipants(eventUUID).then(data =>{
        // console.log(data);
    });

   
}

getNumberOfParticipants = function(uuid, callback){
    getDoodleEventByUUIDIntern(uuid, data =>{
        callback(data.event.numberParticipants);
    });
}

incrementNumberParticipants = function(uuid){
    console.log('inside inrement');
    return new Promise((resolve, reject) => {
        getNumberOfParticipants(uuid, number =>{
            console.log('number Participants: ' + number);
            let criteria = {uuid: uuid};
            let update = {numberParticipants: (number+1)};
            mongodb.updateItem(mongodb.doodleEventDBInfo.dbName, mongodb.doodleEventDBInfo.collectionName, criteria, update).then(data =>{
                resolve(data);
            }).catch(err =>{
                reject(err);
            });
        });
    });
    

   
}

// sets date with date id true in dates array of an participant
exports.addDateToExistingParticipant = function(req, res, next){
    let partId = req.body.participantId;
    let dateId = req.body.dateId;
    getParticipantById(partId, data =>{
        // console.log(data.dates);
        let newDatesArray= data.dates;
        newDatesArray.map(date => {
            if(date.dateId === dateId){
                // console.log(date);
                date.participates = true;
                // update array in database
                let criteria = {_id: partId};
                let update = {dates: newDatesArray};
                mongodb.updateItem(mongodb.doodleParticipantDBInfo.dbName, mongodb.doodleParticipantDBInfo.collectionName, criteria, update);

            }
        })
    });


}

getAllParticipatesIntern = function (callback) {
    // console.log("allparts");
    mongodb.getAllItems(mongodb.doodleParticipantDBInfo.dbName, mongodb.doodleParticipantDBInfo.collectionName).then(data => {
        if (data.success) {
                    callback({data});
        }
    });
}

getParticipantById = function(partId, callback){
    getAllParticipatesIntern(data =>{
        // console.log(data.data.data);
        let partArray = data.data.data;
        partArray.map(p =>{
            if(p._id == partId){
                callback(p);
            }
        });
    });
}

getParticipantByUUID = function(eventUUID, callback){
    let participants = [];
    getAllParticipatesIntern(data =>{
        // console.log(data.data.data);
        let partArray = data.data.data;
        partArray.map(p =>{
            if(p.eventUUID === eventUUID){
                participants.push(p);
            }
        });
        callback(participants);
    });
}
