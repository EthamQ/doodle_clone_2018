const mongodb = require('./../../MongoDB/dbUtils');
const uuid = require('uuid/v4');
const ParticipantModel = require('./../../models/participant/participantModel');
const ResponseBuilder = require('./../responseBuilder');
const dateLogic = require('./../date/dateLogic');

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

module.exports = {
    addParticipantToEvent: addParticipantToEvent,
    removeParticipants: removeParticipants,
    updateParticipantsWithUUID: updateParticipantsWithUUID
}