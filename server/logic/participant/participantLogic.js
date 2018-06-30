const mongodb = require('./../../MongoDB/dbUtils');
const uuid = require('uuid/v4');
const ParticipantModel = require('./../../models/participant/participantModel');
const ResponseBuilder = require('./../responseBuilder');
const dateLogic = require('./../date/dateLogic');

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
 * called by addDatesToParticipant or removeDatesFromParticipant
 * with different parameters
 */
addRemoveDatesParticipant = function (adminUUID, participantId, indexArray, shouldAdd) {
    return new Promise((resolve, reject) => {
        getDoodleEventByCreatorUUID(adminUUID, data => {
            let participantsUpdated = data.event.participants;
            let uuid = data.event.uuid;
            let maxIndex = data.event.date.length - 1;
            // variables to detect if a participant was found
            let i = 0;
            let partIdFound = false;
            participantsUpdated.map(participant => {
                if (participant.id == participantId) {
                    partIdFound = true;
                    indexArray.map(index => {
                        if (index > maxIndex) {
                            resolve({ success: false, errorMsg: "Highest allowed Index is " + maxIndex + "!" });
                        }
                        participant.dates[index] = shouldAdd;
                    });
                    updateParticipantsWithUUID(uuid, participantsUpdated).then(() => {
                        resolve({ success: true });
                    }).catch(err => {
                        reject(err);
                    });
                }
                // no participant with the id found
                else if (isLastIteration(i, participantsUpdated) && !partIdFound) {
                    resolve({ success: false, errorMsg: "ParticipantId not found" });
                }
                i++;
            });
        });
    });
}

module.exports = {
    addRemoveDatesParticipant: addRemoveDatesParticipant,
    updateParticipantsWithUUID: updateParticipantsWithUUID,
}