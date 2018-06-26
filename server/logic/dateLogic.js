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
addDatesToExistingEvent = function (req, res, next) {
    let responseBuilder = new ResponseBuilder();
    let dates = req.body.dates;
    generateDateIds(dates, newDateIds => {
        addDatesToDateCollection(req, res, next, newDateIds, responseBuilder).then(data => {
            addDatesToEvent(data.event, newDateIds, data.responseBuilder).then(responseBuilder => {
                responseBuilder.setMessage("Dates have been added to the event");
                res.send(responseBuilder.getResponse());
            }).catch(err => {
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
generateDateIds = function (dates, callback) {
    let newDateIds = [];
    dates.map(date => {
        newDateIds.push(uuid());
    });
    callback(newDateIds);
}

/**
 * adds the dates from the request to the dates collection
 * adds all the ids from the dateIds Array
 */
addDatesToDateCollection = function (req, res, next, dateIds, responseBuilder) {
    return new Promise((resolve, reject) => {
        let dates = req.body.dates;
        let creatorUUID = req.params.creatorUUID;
        console.log(dateIds);
        getDoodleEventByCreatorUUID(creatorUUID, data => {
            let uuidEvent = data.uuidEvent;
            let event = data.event;
            // add dates to date collection
            let i = 0;
            dates.map(date => {
                let dateModel = new DateModel();
                dateModel.setId(dateIds[i++], () => {
                    dateModel.setUUID(uuidEvent, () => {
                        dateModel.setModelProperty(date, () => {
                            dateModel.saveModelInDatabase().then(data => {
                                responseBuilder.setSuccess(data.success);
                            }).catch(err => {
                                console.log(err);
                                reject(err);
                            });
                        });
                    });
                });
            });
            resolve({ event: event, responseBuilder: responseBuilder });
        });
    });
}

/**
 * updates the date array of an event in the event collection
 * adds the date ids of the dateIds Array
 */
addDatesToEvent = function (event, dateIds, responseBuilder) {
    return new Promise((resolve, reject) => {
        let datesToUpdate = event.date;
        dateIds.map(id => {
            datesToUpdate.push({ date_id: id });
        });
        let criteria = { uuid: event.uuid };
        let update = { date: datesToUpdate };
        mongodb.updateItem(mongodb.doodleEventDBInfo.dbName, mongodb.doodleEventDBInfo.collectionName, criteria, update).then(data => {
            responseBuilder.setSuccess(data.success);
            resolve(responseBuilder);
        }).catch(err => {
            reject(err);
        });
    });
}

/**
 * called by the router
 * POST '/date/update/:creatorUUID'
 * updates a date with the 'dateId' from the body with the values
 * from 'date' from the request
 */
updateExistingDate = function (req, res, next) {
    let responseBuilder = new ResponseBuilder();
    let creatorUUID = req.params.creatorUUID;
    let dateId = req.body.dateId;
    let newDate = req.body.date;

    creatorIdValid(creatorUUID, valid => {
        if (valid) {
            let criteria = { _id: dateId };
            let update = {
                date: newDate.date,
                timeFrom: newDate.timeFrom,
                timeTo: newDate.timeTo
            }
            mongodb.updateItem(
                mongodb.doodleDateDBInfo.dbName,
                mongodb.doodleDateDBInfo.collectionName,
                criteria,
                update
            ).then(data => {
                if (data.success) {
                    responseBuilder.setMessage("Date successfully updated");
                    responseBuilder.setSuccess(true);
                    res.send(responseBuilder.getResponse());
                }
            }).catch(err => {
                responseBuilder.setMessage(responseBuilder.getDatabaseFailureMsg());
                responseBuilder.setSuccess(false);
                res.send(responseBuilder.getResponse());
            });
        }
        else {
            responseBuilder.setMessage("Not a valid creator uuid");
            responseBuilder.setSuccess(false);
            res.send(responseBuilder.getResponse());
        }
    });
}

creatorIdValid = function (creatorUUID, callback) {
    getDoodleEventByCreatorUUID(creatorUUID, data => {
        if (data.success) {
            callback(true);
        }
        else {
            callback(false);
        }
    });
}


/**
 * called by the router
 * POST '/date/delete/:creatorUUID'
 * deletes a date from the event and the date collection given its dateId
 * and function checks if creatorUUID exists
 * TODO: check if date belongs to this creator uuid
 */
deleteDatesFromEvent = function (req, res, next) {
    let responseBuilder = new ResponseBuilder();
    let creatorUUID = req.params.creatorUUID;
    let dateId = req.body.dateId;
    getDoodleEventByCreatorUUID(creatorUUID, data => {
        if(data.success){
            removeDateInEventCollection(creatorUUID, dateId, data).then(() => {
                removeDateInDateCollection(creatorUUID, dateId).then(() => {
                    responseBuilder.setSuccess(true);
                    res.setMessage("Date successfully removed");
                    res.send(responseBuilder.getResponse());
                }).catch(err => {
                    responseBuilder.setSuccess(false);
                    res.send(responseBuilder.getResponse());
                });
            }).catch(err => {
                responseBuilder.setSuccess(false);
                res.send(responseBuilder.getResponse());
            });
        }
        else{
            responseBuilder.setSuccess(false);
            res.send(responseBuilder.getResponse());
        }
    });
}

removeDateInDateCollection = function (creatorUUID, dateId) {
    return new Promise((resolve, reject) => {
        mongodb.deleteItemWithId(
            mongodb.doodleDateDBInfo.dbName,
            mongodb.doodleDateDBInfo.collectionName,
            dateId
        ).then(() => {
            resolve();
        }).catch(err => {
            reject(new Error("Something went wrong when deleting the date from the date collection"));
        });
    });
}

removeDateInEventCollection = function (creatorUUID, dateId, data) {
    return new Promise((resolve, reject) => {
        let uuidEvent = data.uuidEvent;
        let event = data.event;
        let datesUpdated = event.date;
        for (let i = 0; i < datesUpdated.length; i++) {
            console.log(datesUpdated[i]);
            if (datesUpdated[i].date_id == dateId) {
                datesUpdated.splice(i, 1);
                let criteria = { uuid: uuidEvent };
                let update = { date: datesUpdated };
                mongodb.updateItem(
                    mongodb.doodleEventDBInfo.dbName,
                    mongodb.doodleEventDBInfo.collectionName,
                    criteria,
                    update
                ).then(data => {
                    if (data.success) {
                        resolve();
                    }
                }).catch(err => {
                    reject(err);
                });
                break;
            }
            else {
                if (i === (datesUpdated.length-1)) {
                    reject(new Error("dateId not found in event collection"));
                }
            }
        }
    });
}

module.exports = {
    getAllDatesIntern: getAllDatesIntern,
    getDatesByEventId: getDatesByEventId,
    addDateToExistingParticipant: addDateToExistingParticipant,
    addDatesToExistingEvent: addDatesToExistingEvent,
    updateExistingDate: updateExistingDate,
    deleteDatesFromEvent: deleteDatesFromEvent,
}