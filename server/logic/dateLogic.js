var mongodb = require('./../MongoDB/dbUtils');
const participantLogic = require('./participantLogic');
const eventLogic = require('./doodleEventLogic');
var ResponseBuilder = require('./responseBuilder');
var DateModel = require('./../models/date/doodleDateModel');
const uuid = require('uuid/v4');
var mongodb = require('./../MongoDB/dbUtils');

/**
 * return all dates in the date collection in a callback
 */
getAllDatesIntern = function (callback) {
    mongodb.getAllItems(mongodb.doodleDateDBInfo.dbName, mongodb.doodleDateDBInfo.collectionName).then(data => {
        if (data.success) {
            callback({ data });
        }
    }).catch(err => {
        callback({ data: null, success: false });
    });
}

/**
 * return the event with the specified eventId in a callback
 * an event has an identical _id and uuid
 */
getDatesByEventId = function (eventId, callback) {
    mongodb.getAllItems(mongodb.doodleDateDBInfo.dbName, mongodb.doodleDateDBInfo.collectionName).then(data => {
        if (data.success) {
            let eventsWithEventId = data.data.filter(el => el.uuid == eventId);
            callback(eventsWithEventId);
        }
    });
}

/**
 * called by the route POST '/participant/add/date'
 * a participant has an array with all dates of the event he takes part
 * sets the 'participates' value of the date boolean to true
 * expects from the POST request: {participantId, dateId}
 */
addDateToExistingParticipant = function (req, res, next) {
    let responseBuilder = new ResponseBuilder();
    let partId = req.body.participantId;
    let dateId = req.body.dateId;
    getParticipantById(partId, data => {
        if (data == null) {
            responseBuilder.setSuccess(false);
            responseBuilder.setMessage("A participant with the id wasn't found");
            res.send(responseBuilder.getResponse());
        }
        else {
            let newDatesArray = data.data.dates;
            newDatesArray.map(date => {
                if (date.dateId === dateId) {
                    date.participates = true;
                    // update array in database
                    let criteria = { _id: partId };
                    let update = { dates: newDatesArray };
                    mongodb.updateItem(mongodb.doodleParticipantDBInfo.dbName, mongodb.doodleParticipantDBInfo.collectionName, criteria, update)
                        .then(data => {
                            if (data.success) {
                                responseBuilder.setSuccess(true);
                                responseBuilder.setMessage(responseBuilder.getDateAddedToParticipantSuccessMsg());
                                res.send(responseBuilder.getResponse());
                            }
                        }).catch(err => {
                            responseBuilder.setSuccess(false);
                            responseBuilder.setMessage(responseBuilder.getDatabaseFailureMsg());
                            res.send(responseBuilder.getResponse());
                        });
                }
            })
        }
    });
}

/**
 * calles by POST '/date/add/:creatorUUID'
 * adds the dates in the request to the event in the event collection
 * and creates new entries for them in the date collection
 */
addDatesToExistingEvent = function(req, res, next){
    let responseBuilder = new ResponseBuilder();
    let dates = req.body.dates;
    generateDateIds(dates, newDateIds=>{
        addDatesToDateCollection(req, res, next, newDateIds, responseBuilder).then(data =>{
            addDatesToEvent(data.event, newDateIds, data.responseBuilder).then(responseBuilder =>{
                responseBuilder.setMessage("Dates have been added to the event");
                res.send(responseBuilder.getResponse());
            }).catch(err =>{
                responseBuilder.setMessage(responseBuilder.getDatabaseFailureMsg());
                responseBuilder.setSuccess(false);
                res.send(responseBuilder.getResponse());
            });
        });
    });
}

/**
 * generate one new id for each date in the dates array
 * and return them in a callback
 */
generateDateIds = function(dates, callback){
    let newDateIds = [];
    dates.map(date =>{
        newDateIds.push(uuid());
    });
    callback(newDateIds);
}

/**
 * adds the dates from the request to the dates collection
 * adds all the ids from the dateIds Array
 */
addDatesToDateCollection = function(req, res, next, dateIds, responseBuilder){
    return new Promise((resolve, reject) =>{
        let dates = req.body.dates;
        let creatorUUID = req.params.creatorUUID;
        console.log(dateIds);
        getDoodleEventByCreatorUUID(creatorUUID, data=>{
            let uuidEvent = data.uuidEvent;
            let event = data.event;
            // add dates to date collection
            let i = 0;
            dates.map(date =>{
                let dateModel = new DateModel();
                dateModel.setId(dateIds[i++], ()=>{
                    dateModel.setUUID(uuidEvent, ()=>{
                        dateModel.setModelProperty(date, ()=>{
                            dateModel.saveModelInDatabase().then(data =>{
                                responseBuilder.setSuccess(data.success);
                            }).catch(err =>{
                                console.log(err);
                                reject(err);
                            });
                        });
                    });
                });
            });
            resolve({event: event, responseBuilder: responseBuilder});
        }); 
    });
}

/**
 * updates the date array of an event in the event collection
 * adds the date ids of the dateIds Array
 */
addDatesToEvent = function(event, dateIds, responseBuilder){
    return new Promise((resolve, reject)=>{
        let datesToUpdate = event.date;
        dateIds.map(id =>{
            datesToUpdate.push({date_id: id});
        });
        let criteria = {uuid: event.uuid};
        let update = {date: datesToUpdate};
        mongodb.updateItem(mongodb.doodleEventDBInfo.dbName, mongodb.doodleEventDBInfo.collectionName, criteria, update).then(data=>{
            responseBuilder.setSuccess(data.success);
            resolve(responseBuilder);
        }).catch(err =>{
            reject(err);
        });
    });
 
}

module.exports = {
    getAllDatesIntern: getAllDatesIntern,
    getDatesByEventId: getDatesByEventId,
    addDateToExistingParticipant: addDateToExistingParticipant,
    addDatesToExistingEvent: addDatesToExistingEvent
}