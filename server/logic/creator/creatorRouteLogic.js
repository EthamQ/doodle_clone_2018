const creatorLogic = require('./creatorLogic');
const mongodb = require('./../../MongoDB/dbUtils');
const uuid = require('uuid/v4');
const ParticipantModel = require('./../../models/participant/participantModel');
const ResponseBuilder = require('./../responseBuilder');
const dateLogic = require('./../date/dateLogic');

/**
 * called by the router
 * POST 'creator/date/remove/:adminUUID'
 * sets indexes of dates array of creator to true
 */
addDatesToCreator = function (req, res, next) {
    let responseBuilder = new ResponseBuilder();
    let dateIndexToAdd = req.body.dateIndexToAdd;
    let adminUUID = req.params.adminUUID;
    let shouldAdd = true;
    addRemoveDatesCreator(adminUUID, dateIndexToAdd, shouldAdd).then(data => {
        if (data.success) {
            responseBuilder.addMessage("Dates successfully added to creator");
            responseBuilder.setSuccess(true);
            res.send(responseBuilder.getResponse());
        }
        else {
            responseBuilder.addMessage(data.message);
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
 * called by the router
 * POST 'creator/date/remove/:adminUUID'
 * sets indexes of dates array of creator to false
 */
removeDatesFromCreator = function (req, res, next) {
    let responseBuilder = new ResponseBuilder();
    let dateIndexToRemove = req.body.dateIndexToRemove;
    let adminUUID = req.params.adminUUID;
    let shouldAdd = false;
    addRemoveDatesCreator(adminUUID, dateIndexToRemove, shouldAdd).then(data => {
        if (data.success) {
            responseBuilder.addMessage("Dates successfully removed from creator");
            responseBuilder.setSuccess(true);
            res.send(responseBuilder.getResponse());
        }
        else {
            responseBuilder.addMessage(data.message);
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

updateDatesFromCreator = function (req, res, next) {
    console.log("updatedates");
    let responseBuilder = new ResponseBuilder();
    let updatedDates = req.body.updatedDates;
    let adminUUID = req.params.adminUUID;
    getDoodleEventByCreatorUUID(adminUUID, data => {
        if (data.success) {
            let creatorUpdated = data.event.creator;
            if (updatedDates.length == creatorUpdated.dates.length) {
                creatorUpdated.dates = updatedDates;
                let uuid = data.event.uuid;
                updateCreatorWithUUID(uuid, creatorUpdated).then(() => {
                    responseBuilder.addMessage("Admin dates successfully updated");
                    responseBuilder.setSuccess(true);
                    res.send(responseBuilder.getResponse());
                }).catch(err => {
                    responseBuilder.addMessage(responseBuilder.getDatabaseFailureMsg());
                    responseBuilder.addMessage(err.toString());
                    responseBuilder.setSuccess(false);
                    res.send(responseBuilder.getResponse());
                    reject(err);
                });
            }
            else {
                responseBuilder.addMessage("The length of the sent array has to be the same length like the previous admin dates array");
                responseBuilder.setSuccess(false);
                res.send(responseBuilder.getResponse());
            }
        }
        else {
            responseBuilder.addMessage("No event with this admin uuid found");
            responseBuilder.setSuccess(false);
            res.send(responseBuilder.getResponse());
        }
    });
}

module.exports = {
    removeDatesFromCreator: removeDatesFromCreator,
    addDatesToCreator: addDatesToCreator,
    updateDatesFromCreator: updateDatesFromCreator,
}