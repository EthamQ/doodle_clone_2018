var mongodb = require('./../../MongoDB/dbUtils');
const uuid = require('uuid/v4');
var DoodleParticipantModel = require('./../../models/participant/doodleParticipantModel');
var ParticipantModel = require('./../../models/participant/doodleParticipantModel');
var ResponseBuilder = require('./../responseBuilder');

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
    participantModel = new ParticipantModel();
    participantModel.setId();
    participantModel.setModelProperty(participant, () => {
        getDoodleEventByUUID(eventUUID, eventData => {
            let participantsOld = eventData.event.participants;
            participantsOld.push(participantModel.getModel());
            let criteria = { uuid: eventUUID };
            let update = {
                participants: participantsOld,
                numberParticipants: (eventData.event.numberParticipants + 1)
            };
            mongodb.updateItemInEventCollection(criteria, update).then(data => {
                responseBuilder.setSuccess(true);
                responseBuilder.addMessage(responseBuilder.getParticipantAddedSuccessMsg());
                res.send(responseBuilder.getResponse());

            }).catch(err => {
                responseBuilder.setSuccess(false);
                responseBuilder.addMessage(responseBuilder.getDatabaseFailureMsg());
                res.send(responseBuilder.getResponse());
            });
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