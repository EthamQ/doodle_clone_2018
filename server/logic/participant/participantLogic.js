const mongodb = require('./../../MongoDB/dbUtils');
const uuid = require('uuid/v4');
const ParticipantModel = require('./../../models/participant/participantModel');
const ResponseBuilder = require('./../responseBuilder');

/**
 * called by the router
 * POST '/participant/:uuid'
 * adds participant to event collection and participant collection
 * TODO: check if dateArray.length == date.length
 */
addParticipantToEvent = function (req, res, next) {
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
                    let update = {
                        participants: participantsOld,
                        numberParticipants: (data.event.numberParticipants + 1)
                    };
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
    let adminUUID = req.params.adminUUID;
    let participantsUpdated = req.body.participantsUpdated;
    getDoodleEventByCreatorUUID(adminUUID, data => {
        if (data.success) {
            if (participantsUpdated.length < data.event.participants.length) {
                let criteria = { uuid: data.uuidEvent };
                let update = {
                    participants: participantsUpdated,
                    numberParticipants: (data.event.numberParticipants - 1)
                };
                mongodb.updateItemInEventCollection(criteria, update).then(() => {
                    responseBuilder.setSuccess(true);
                    responseBuilder.addMessage("Participants successfully removed");
                    res.send(responseBuilder.getResponse());
                }).catch(err => {
                    responseBuilder.setSuccess(true);
                    responseBuilder.addMessage(responseBuilder.getDatabaseFailureMsg());
                    res.send(responseBuilder.getResponse());
                });
            }
            else {
                responseBuilder.setSuccess(false);
                responseBuilder.addMessage("The length of the updatedParticipants has to be lesser than the initial array if you want to remove a participant");
                res.send(responseBuilder.getResponse());
            }
        }
        else {
            responseBuilder.setSuccess(false);
            responseBuilder.addMessage(responseBuilder.getDoodleEventByCreatorUUIDFailureMsg());
            res.send(responseBuilder.getResponse());
        }
    });
}

module.exports = {
    addParticipantToEvent: addParticipantToEvent,
    removeParticipants: removeParticipants
}