var mongodb = require('./../../MongoDB/dbUtils');
const participantLogic = require('./../participant/participantLogic');
const eventLogic = require('./../event/doodleEventLogic');
var ResponseBuilder = require('./../responseBuilder');
var DateModel = require('./../../models/date/doodleDateModel');
const uuid = require('uuid/v4');
var mongodb = require('./../../MongoDB/dbUtils');

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
 * updates the date array of an event in the event collection
 * adds the date ids of the dateIds Array
 * TODO: add dates to participants
 */
addDatesToEvent = function (req, res, next) {
    let responseBuilder = new ResponseBuilder();
    let adminUUID = req.params.adminUUID;
    let newDates = req.body.newDates;
    getDoodleEventByCreatorUUID(adminUUID, data => {
        if (data.success) {
            let datesUpdated = data.event.date;
            newDates.map(newDate => {
                datesUpdated.push(newDate);
            });
            let criteria = { uuid: data.event.uuid };
            let update = { date: datesUpdated };
            mongodb.updateItem(mongodb.doodleEventDBInfo.dbName,
                mongodb.doodleEventDBInfo.collectionName,
                criteria,
                update).then(() => {
                    responseBuilder.setMessage("Dates successfully added");
                    responseBuilder.setSuccess(true);
                    res.send(responseBuilder.getResponse());

                }).catch(err => {
                    responseBuilder.setMessage(responseBuilder.getDatabaseFailureMsg());
                    responseBuilder.setSuccess(false);
                    res.send(responseBuilder.getResponse());
                });
        }
        else {
            responseBuilder.setMessage(responseBuilder.getDoodleEventByCreatorUUIDFailureMsg());
            responseBuilder.setSuccess(false);
            res.send(responseBuilder.getResponse());
        }
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
            responseBuilder.setMessage(responseBuilder.getDoodleEventByCreatorUUIDFailureMsg());
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

// TODO remove date from participants
removeDatesOfEvent = function (req, res, next) {
    let datesRemoveIndex = req.body.datesRemoveIndex;
    getDoodleEventByCreatorUUID(creatorUUID, data => {
        if (data.success) {
            let updatedDates = data.event.date;
            datesRemoveIndex.map(index => {
                updatedDates.splice(index, 1);
            });
            let criteria = { uuid: data.event.uuid };
            let update = { date: updatedDates };
            updateItem(criteria, update).then(data => {
                responseBuilder.setMessage("Date(s) successfully removed");
                responseBuilder.setSuccess(true);
                res.send(responseBuilder.getResponse());
            }).catch(err => {
                responseBuilder.setMessage(responseBuilder.getDatabaseFailureMsg());
                responseBuilder.setSuccess(false);
                res.send(responseBuilder.getResponse());
            });
        }
        else {
            responseBuilder.setMessage(responseBuilder.getDoodleEventByCreatorUUIDFailureMsg());
            responseBuilder.setSuccess(false);
            res.send(responseBuilder.getResponse());
        }
    });
}

updateItem = function (criteria, update) {
    return new Promise((resolve, reject) => {
        mongodb.updateItem(
            mongodb.doodleEventDBInfo.dbName,
            mongodb.doodleEventDBInfo.collectionName,
            criteria,
            update
        ).then(data => {
            resolve();
        }).catch(err => {
            reject(err);
        });
    });

}








module.exports = {
    getAllDatesIntern: getAllDatesIntern,
    getDatesByEventId: getDatesByEventId,
    addDatesToEvent: addDatesToEvent,
}