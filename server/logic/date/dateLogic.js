const mongodb = require('./../../MongoDB/dbUtils');
const participantLogic = require('./../participant/participantLogic');
const eventLogic = require('./../event/doodleEventLogic');
const ResponseBuilder = require('./../responseBuilder');
const DateModel = require('./../../models/date/dateModel');
const uuid = require('uuid/v4');

/**
 * called by the router
 * POST '/date/add/:adminUUID'
 * add dates to the date array of an event
 * and add a false boolean to every new date
 * to the dates array of every participant and the creaotr
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
            let update = {
                date: datesUpdated,
                participants: participantsUpdated
            };
            mongodb.updateItemInEventCollection(criteria, update).then(() => {
                responseBuilder.addMessage("Dates successfully added");
                responseBuilder.setSuccess(true);
                res.send(responseBuilder.getResponse());
            }).catch(err => {
                responseBuilder.addMessage(responseBuilder.getDatabaseFailureMsg());
                responseBuilder.addMessage(err.toString());
                responseBuilder.setSuccess(false);
                res.send(responseBuilder.getResponse());
            });
        }
        else {
            responseBuilder.addMessage(responseBuilder.getDoodleEventByCreatorUUIDFailureMsg());
            responseBuilder.addMessage(err.toString());
            responseBuilder.setSuccess(false);
            res.send(responseBuilder.getResponse());
        }
    });
}

/**
 * called by router
 * POST '/date/delete/:adminUUID'
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
            let update = {
                date: updatedDates,
                participants: updatedParticipants,
                creator: updatedCreator
            };
            mongodb.updateItemInEventCollection(criteria, update).then(data => {
                responseBuilder.addMessage("Date(s) successfully removed");
                responseBuilder.setSuccess(true);
                res.send(responseBuilder.getResponse());
            }).catch(err => {
                responseBuilder.addMessage(responseBuilder.getDatabaseFailureMsg());
                responseBuilder.addMessage(err.toString());
                responseBuilder.setSuccess(false);
                res.send(responseBuilder.getResponse());
            });
        }
        else {
            responseBuilder.addMessage(responseBuilder.getDoodleEventByCreatorUUIDFailureMsg());
            responseBuilder.setSuccess(false);
            res.send(responseBuilder.getResponse());
        }
    });
}

/**
 * called by router
 * POST '/date/participant/add/:adminUUID'
 */
addDatesToParticipant = function (req, res, next) {
    let responseBuilder = new ResponseBuilder();
    let participantId = req.body.participantId;
    let dateIndexToAdd = req.body.dateIndexToAdd;
    let adminUUID = req.params.adminUUID;
    let shouldAdd = true;
    addRemoveDatesParticipant(adminUUID, participantId, dateIndexToAdd, shouldAdd).then(data => {
        if(data.success){
            responseBuilder.addMessage("Dates successfully added");
            responseBuilder.setSuccess(true);
            res.send(responseBuilder.getResponse());
        }
        else{
            responseBuilder.addMessage(data.errorMsg);
            responseBuilder.setSuccess(false);
            res.send(responseBuilder.getResponse());
        }
        
    }).catch(err => {
        responseBuilder.addMessage(responseBuilder.getDatabaseFailureMsg());
        responseBuilder.addMessage(err.toString());
        responseBuilder.setSuccess(false);
        res.send(responseBuilder.getResponse());
    });
}

/**
 * called by router
 * POST '/date/participant/remove/:adminUUID'
 */
removeDatesFromParticipant = function (req, res, next) {
    let responseBuilder = new ResponseBuilder();
    let participantId = req.body.participantId;
    let dateIndexToRemove = req.body.dateIndexToRemove;
    let adminUUID = req.params.adminUUID;
    let shouldAdd = false;
    addRemoveDatesParticipant(adminUUID, participantId, dateIndexToRemove, shouldAdd).then(data => {
        if(data.success){
            responseBuilder.addMessage("Dates successfully removed");
            responseBuilder.setSuccess(true);
            res.send(responseBuilder.getResponse());
        }
        else{
            responseBuilder.addMessage(data.errorMsg);
            responseBuilder.setSuccess(false);
            res.send(responseBuilder.getResponse());
        }
    }).catch(err => {
        responseBuilder.addMessage(responseBuilder.getDatabaseFailureMsg());
        responseBuilder.addMessage(err.toString());
        responseBuilder.setSuccess(false);
        res.send(responseBuilder.getResponse());
    });
}

/**
 * called by addDatesToParticipant or removeDatesFromParticipant
 * with different parameters
 */
addRemoveDatesParticipant = function (adminUUID, participantId, indexArray, shouldAdd) {
    return new Promise((resolve, reject) => {
        getDoodleEventByCreatorUUID(adminUUID, data => {
            let participantsUpdated = data.event.participants;
            let uuid = data.event.uuid;
            let maxIndex = data.event.date.length - 1;
            let i = 0;
            let partIdFound = false;

            participantsUpdated.map(participant => {
                if (participant.id == participantId) {
                    partIdFound = true;
                    indexArray.map(index => {
                        if(index > maxIndex){
                            resolve({ success: false, errorMsg: "Highest allowed Index is " + maxIndex + "!"});
                        }
                        participant.dates[index] = shouldAdd;
                    });
                    updateParticipantsWithUUID(uuid, participantsUpdated).then(() => {
                        resolve({ success: true });
                    }).catch(err => {
                        reject(err);
                    });
                }
                else if(isLastIteration(i, participantsUpdated) && !partIdFound){
                    resolve({ success: false, errorMsg: "ParticipantId not found"});
                }
                i++;
            });
        });
    });
}

isLastIteration = function(counter, array){
    return counter === (array.length - 1);
}

/**
 * uuid belongs to the event
 * helper functions to easily update the participants array in an event
 */
updateParticipantsWithUUID = function (uuid, participantsUpdated) {
    return new Promise((resolve, reject) => {
        let criteria = { uuid: uuid };
        let update = { participants: participantsUpdated };
        mongodb.updateItemInEventCollection(criteria, update).then(() => {
            resolve();
        }).catch(err => {
            reject(err);
        });
    });

}

/**
 * uuid belongs to the event
 * helper functions to easily update the creator in an event
 */
updateCreatorWithUUID = function (uuid, creatorUpdated) {
    return new Promise((resolve, reject) => {
        let criteria = { uuid: uuid };
        let update = { creator: creatorUpdated };
        mongodb.updateItemInEventCollection(criteria, update).then(() => {
            resolve();
        }).catch(err => {
            reject(err);
        });
    });
}

/**
 * called by addDatesToCreator or removeDatesFromCreator
 * with different parameters
 */
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
        responseBuilder.addMessage("Dates successfully added to creator");
        responseBuilder.setSuccess(true);
        res.send(responseBuilder.getResponse());
    }).catch(err => {
        responseBuilder.addMessage(responseBuilder.getDatabaseFailureMsg());
        responseBuilder.addMessage(err.toString());
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
        responseBuilder.addMessage("Dates successfully removed from creator");
        responseBuilder.setSuccess(true);
        res.send(responseBuilder.getResponse());
    }).catch(err => {
        responseBuilder.addMessage(responseBuilder.getDatabaseFailureMsg());
        responseBuilder.addMessage(err.toString());
        responseBuilder.setSuccess(false);
        res.send(responseBuilder.getResponse());
    });
}

module.exports = {
    addDatesToEvent: addDatesToEvent,
    removeDatesOfEvent: removeDatesOfEvent,
    addDatesToParticipant: addDatesToParticipant,
    removeDatesFromParticipant: removeDatesFromParticipant,
    removeDatesFromCreator: removeDatesFromCreator,
    addDatesToCreator: addDatesToCreator,
}