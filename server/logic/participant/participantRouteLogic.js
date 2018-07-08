const mongodb = require('./../../MongoDB/dbUtils');
const uuid = require('uuid/v4');
const ParticipantModel = require('./../../models/participant/participantModel');
const ResponseBuilder = require('./../responseBuilder');
const dateLogic = require('./../date/dateLogic');
const participantLogic = require('./participantLogic');

/**
 * called by the router
 * POST '/participant/:uuid'
 * adds participant to event collection and participant collection
 * TODO: check if dateArray.length == date.length
 */
addParticipantToEvent = function (req, res, next) {
    res.setHeader("Content-Type", "application/json"); 
    let responseBuilder = new ResponseBuilder();
    let eventUUID = req.params.uuid;
    let participant = req.body;
    let participantModel = new ParticipantModel();
    participantModel.setId();
    participantModel.setModelProperty(participant, () => {
        getDoodleEventByUUID(eventUUID, data => {
            if (data.success) {
                if(participantModel.participantDatesValid(data.event.date)){
                    let participantsOld = data.event.participants;
                    participantsOld.push(participantModel.getModel());
                    let criteria = { uuid: eventUUID };
                    let update = { participants: participantsOld };
                    mongodb.updateItemInEventCollection(criteria, update).then(data => {
                        responseBuilder.setSuccess(true);
                        responseBuilder.addMessage(responseBuilder.getParticipantAddedSuccessMsg());
                        res.send(responseBuilder.getResponse());
    
                    }).catch(err => {
                        responseBuilder.setSuccess(false);
                        responseBuilder.addMessage(responseBuilder.getDatabaseFailureMsg());
                        responseBuilder.addMessage(err.toString());
                        res.send(responseBuilder.getResponse());
                    });
                }
                else{
                    responseBuilder.setSuccess(false);
                    responseBuilder.addMessage("The amount of dates of the participant has to be equal to the amount of dates of the event which is " + data.event.date.length);
                    res.send(responseBuilder.getResponse());
                }
                
            }
            else {
                responseBuilder.setSuccess(false);
                responseBuilder.addMessage(responseBuilder.getDoodleEventByUUIDFailureMsg());
                res.send(responseBuilder.getResponse());
            }

        });
    });
}


/**
 * called by router
 * POST '/participant/remove/:eventUUID'
 * removes a participant with the corresponding
 * participantId from the event collection and the participant
 * collection
 */
removeParticipants = function (req, res, next) {
    let responseBuilder = new ResponseBuilder();
    res.setHeader("Content-Type", "application/json"); 
    if(!req.body.participantIdArray){
        responseBuilder.setSuccess(false);
        responseBuilder.addMessage(responseBuilder.getValuesMissingFailureMsg());
        res.send(responseBuilder.getResponse());
    }
    else{
        let adminUUID = req.params.adminUUID;
        participantIdArray = req.body.participantIdArray;
        getDoodleEventByCreatorUUID(adminUUID, data => {
            if (data.success) {
                let participantsUpdated = data.event.participants;
                let i = 0;
                let numberRemovedParticipants = 0;
                participantsUpdated.map(participant =>{
                    participantIdArray.map(id =>{
                        if(participant.id == id){
                            participantsUpdated.splice(i, 1);
                            numberRemovedParticipants++;
                        }
                    });
                    i++;
                });
                    updateParticipantsWithUUID(data.event.uuid, participantsUpdated).then(() => {
                        responseBuilder.setSuccess(true);
                        responseBuilder.addMessage(numberRemovedParticipants + " participant(s) successfully removed");
                        res.send(responseBuilder.getResponse());
                    }).catch(err => {
                        responseBuilder.setSuccess(true);
                        responseBuilder.addMessage(responseBuilder.getDatabaseFailureMsg());
                        res.send(responseBuilder.getResponse());
                    });
            }
            else {
                responseBuilder.setSuccess(false);
                responseBuilder.addMessage(responseBuilder.getDoodleEventByCreatorUUIDFailureMsg());
                res.send(responseBuilder.getResponse());
            }
        });
    }
}


/**
 * called by router
 * POST '/date/participant/add/:adminUUID'
 */
addDatesToParticipant = function (req, res, next) {
    res.setHeader("Content-Type", "application/json"); 
    let responseBuilder = new ResponseBuilder();
    let participantId = req.body.participantId;
    let dateIndexToAdd = req.body.dateIndexToAdd;
    let adminUUID = req.params.adminUUID;
    let shouldAdd = true;
    if(!participantId || !dateIndexToAdd){
        responseBuilder.setSuccess(false);
        responseBuilder.addMessage(responseBuilder.getValuesMissingFailureMsg());
        res.send(responseBuilder.getResponse());
    }
    else{
        addRemoveDatesParticipant(adminUUID, participantId, dateIndexToAdd, shouldAdd).then(data => {
            if (data.success) {
                responseBuilder.addMessage("Dates successfully added");
                responseBuilder.setSuccess(true);
                res.send(responseBuilder.getResponse());
            }
            else {
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
}

/**
 * called by router
 * POST '/date/participant/remove/:adminUUID'
 */
removeDatesFromParticipant = function (req, res, next) {
    res.setHeader("Content-Type", "application/json"); 
    let responseBuilder = new ResponseBuilder();
    let participantId = req.body.participantId;
    let dateIndexToRemove = req.body.dateIndexToRemove;
    let adminUUID = req.params.adminUUID;
    let shouldAdd = false;
    if(!participantId || !dateIndexToRemove){
        responseBuilder.setSuccess(false);
        responseBuilder.addMessage(responseBuilder.getValuesMissingFailureMsg());
        res.send(responseBuilder.getResponse());
    }
    else{
        addRemoveDatesParticipant(adminUUID, participantId, dateIndexToRemove, shouldAdd).then(data => {
            if (data.success) {
                responseBuilder.addMessage("Dates successfully removed");
                responseBuilder.setSuccess(true);
                res.send(responseBuilder.getResponse());
            }
            else {
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
}

module.exports = {
    addParticipantToEvent: addParticipantToEvent,
    removeParticipants: removeParticipants,
    removeDatesFromParticipant: removeDatesFromParticipant,
    addDatesToParticipant: addDatesToParticipant
}