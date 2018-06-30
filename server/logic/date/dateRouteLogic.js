const dateLogic = require('./dateLogic');
const mongodb = require('./../../MongoDB/dbUtils');
const participantLogic = require('./../participant/participantLogic');
const eventLogic = require('./../event/eventLogic');
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
                participants: participantsUpdated,
                creator: updatedCreator
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
    let indexesToDelete = req.body.indexesToDelete;
    let creatorUUID = req.params.adminUUID;
    getResponseForRemovingDates(indexesToDelete, creatorUUID).then(data =>{
        responseBuilder.setSuccess(data.success);
        responseBuilder.addMessage(data.message);
        res.send(responseBuilder.getResponse());
    })
}

module.exports = {
    addDatesToEvent: addDatesToEvent,
    removeDatesOfEvent: removeDatesOfEvent,
}