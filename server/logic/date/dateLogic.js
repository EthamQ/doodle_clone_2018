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
 * called by the router
 * add dates to the date array of an event
 * and add a false boolean to every new date
 * to the dates array of every participant
 */
addDatesToEvent = function (req, res, next) {
    let responseBuilder = new ResponseBuilder();
    let adminUUID = req.params.adminUUID;
    let newDates = req.body.datesToAdd;
    getDoodleEventByCreatorUUID(adminUUID, data => {
        if (data.success) {
            let datesUpdated = data.event.date;
            let participantsUpdated = data.event.participants;
            let updatedCreator = data.event.creator;
            newDates.map(newDate => {
                datesUpdated.push(newDate);
            });
            // add a false boolean to the dates array of every participant for every new date
            participantsUpdated.map(participant => {
                let i = newDates.length;
                while (i > 0) {
                    participant.dates.push(false);
                    i--;
                }
            });
            // add a false boolean to the dates array of the creator for every new date
            let j = newDates.length;
            while (j > 0) {
                updatedCreator.dates.push(false);
                j--;
            }
            let criteria = { uuid: data.event.uuid };
            let update = { date: datesUpdated, participants: participantsUpdated };
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

/**
 * called by router
 * removes date from date array in event
 * and from dates array from participant
 */
removeDatesOfEvent = function (req, res, next) {
    let responseBuilder = new ResponseBuilder();
    let indexesToDelete = req.body.datesRemoveIndex;
    let creatorUUID = req.params.adminUUID;
    getDoodleEventByCreatorUUID(creatorUUID, data => {
        if (data.success) {
            let updatedDates = data.event.date;
            let updatedParticipants = data.event.participants;
            let updatedCreator = data.event.creator;
            // remove dates from dates array
            indexesToDelete.map(index => {
                updatedDates.splice(index, 1);
            });
            // remove dates from every dates Array of every participant
            updatedParticipants.map(participant => {
                indexesToDelete.map(index => {
                    participant.dates.splice(index, 1);
                });
            });
            // remove dates from the dates Array of the creator
            indexesToDelete.map(index => {
                updatedCreator.dates.splice(index, 1);
            });

            let criteria = { uuid: data.event.uuid };
            let update = { date: updatedDates, participants: updatedParticipants, creator: updatedCreator };
            updateItem(criteria, update).then(data => {
                // updateItem().then();
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

addDatesToParticipant = function (req, res, next) {
    let responseBuilder = new ResponseBuilder();
    let participantId = req.body.participantId;
    let dateIndexToAdd = req.body.dateIndexToAdd;
    let adminUUID = req.params.adminUUID;
    let shouldAdd = true;
    addRemoveDatesParticipant(adminUUID, participantId, dateIndexToAdd, shouldAdd).then(() => {
        responseBuilder.setMessage("Dates successfully added");
        responseBuilder.setSuccess(true);
        res.send(responseBuilder.getResponse());
    }).catch(err => {
        responseBuilder.setMessage(err.toString());
        responseBuilder.setSuccess(false);
        res.send(responseBuilder.getResponse());
    });
}

removeDatesFromParticipant = function (req, res, next) {
    let responseBuilder = new ResponseBuilder();
    let participantId = req.body.participantId;
    let dateIndexToRemove = req.body.dateIndexToRemove;
    let adminUUID = req.params.adminUUID;
    let shouldAdd = false;
    addRemoveDatesParticipant(adminUUID, participantId, dateIndexToRemove, shouldAdd).then(() => {
        responseBuilder.setMessage("Dates successfully removed");
        responseBuilder.setSuccess(true);
        res.send(responseBuilder.getResponse());
    }).catch(err => {
        responseBuilder.setMessage(err.toString());
        responseBuilder.setSuccess(false);
        res.send(responseBuilder.getResponse());
    });
}

addRemoveDatesParticipant = function (adminUUID, participantId, indexArray, shouldAdd) {
    return new Promise((resolve, reject) => {
        getDoodleEventByCreatorUUID(adminUUID, data => {
            let participantsUpdated = data.event.participants;
            let uuid = data.event.uuid;
            participantsUpdated.map(participant => {
                if (participant.id == participantId) {
                    indexArray.map(index => {
                        participant.dates[index] = shouldAdd;
                    });
                    updateParticipantsWithUUID(uuid, participantsUpdated).then(() => {
                        resolve();
                    }).catch(err => {
                        reject(err);
                    });
                }
            });
        });
    });
}

updateParticipantsWithUUID = function (uuid, participantsUpdated) {
    return new Promise((resolve, reject) => {
        let criteria = { uuid: uuid };
        let update = { participants: participantsUpdated };
        updateItem(criteria, update).then(() => {
            resolve();
        }).catch(err => {
            reject(err);
        });
    });

}

updateCreatorWithUUID = function (uuid, creatorUpdated) {
    return new Promise((resolve, reject) => {
        let criteria = { uuid: uuid };
        let update = { creator: creatorUpdated };
        updateItem(criteria, update).then(() => {
            resolve();
        }).catch(err => {
            reject(err);
        });
    });
}

addRemoveDatesCreator = function (adminUUID, indexArray, shouldAdd) {
    return new Promise((resolve, reject) => {
        getDoodleEventByCreatorUUID(adminUUID, data => {
            let creatorUpdated = data.event.creator;
            let uuid = data.event.uuid;
            indexArray.map(index => {
                creatorUpdated.dates[index] = shouldAdd;
            });
            updateCreatorWithUUID(uuid, creatorUpdated).then(() => {
                resolve();
            }).catch(err => {
                reject(err);
            });
        });
    });
}

addDatesToCreator = function (req, res, next) {
    let responseBuilder = new ResponseBuilder();
    let dateIndexToAdd = req.body.dateIndexToAdd;
    let adminUUID = req.params.adminUUID;
    let shouldAdd = true;
    addRemoveDatesCreator(adminUUID, dateIndexToAdd, shouldAdd).then(() => {
        responseBuilder.setMessage("Dates successfully added to creator");
        responseBuilder.setSuccess(true);
        res.send(responseBuilder.getResponse());
    }).catch(err => {
        responseBuilder.setMessage(err.toString());
        responseBuilder.setSuccess(false);
        res.send(responseBuilder.getResponse());
    });
}

removeDatesFromCreator = function (req, res, next) {
    let responseBuilder = new ResponseBuilder();
    let dateIndexToRemove = req.body.dateIndexToRemove;
    let adminUUID = req.params.adminUUID;
    let shouldAdd = false;
    addRemoveDatesCreator(adminUUID, dateIndexToRemove, shouldAdd).then(() => {
        responseBuilder.setMessage("Dates successfully removed from creator");
        responseBuilder.setSuccess(true);
        res.send(responseBuilder.getResponse());
    }).catch(err => {
        responseBuilder.setMessage(err.toString());
        responseBuilder.setSuccess(false);
        res.send(responseBuilder.getResponse());
    });
}






module.exports = {
    getAllDatesIntern: getAllDatesIntern,
    getDatesByEventId: getDatesByEventId,
    addDatesToEvent: addDatesToEvent,
    removeDatesOfEvent: removeDatesOfEvent,
    addDatesToParticipant: addDatesToParticipant,
    removeDatesFromParticipant: removeDatesFromParticipant,
    removeDatesFromCreator: removeDatesFromCreator,
    addDatesToCreator: addDatesToCreator,
}