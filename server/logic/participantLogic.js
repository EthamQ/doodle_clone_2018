var mongodb = require('./../MongoDB/dbUtils');
const uuid = require('uuid/v4');

/**
 * returns all participants in the participants collection in a callback
 */
getAllParticipatesIntern = function (callback) {
    mongodb.getAllItems(mongodb.doodleParticipantDBInfo.dbName, mongodb.doodleParticipantDBInfo.collectionName).then(data => {
        if (data.success) {
            callback({ data: data.data , success: true});
        }
    }).catch(err=>{
        callback({ data: null, success: false });
    });
}

/**
 * returns one participant object with the specified _id 
 * from the participants collection in a callback
 */
getParticipantById = function (partId, callback) {
    mongodb.getItemById(mongodb.doodleParticipantDBInfo.dbName, mongodb.doodleParticipantDBInfo.collectionName, partId).then(participant =>{
        callback(participant);
    }).catch(err =>{
        console.log(err);
    })
}

getParticipantByUUID = function (eventUUID, callback) {
    let participants = [];
    console.log("yoyo getParticipantByUUID");
    getAllParticipatesIntern(data => {
        if(data.success){
            let partArray = data.data;
            partArray.map(p => {
                if (p.eventUUID === eventUUID) {
                    participants.push(p);
                }
            });
            callback({data: participants, success: true});
        }
        else{
            callback({data: null, success: false});
        }
        
    });
}


getNumberOfParticipants = function (uuid, callback) {
    getDoodleEventByUUIDIntern(uuid, data => {
        callback(data.event.numberParticipants);
    });
}

incrementNumberParticipants = function (uuid) {
    return new Promise((resolve, reject) => {
        getNumberOfParticipants(uuid, number => {
            let criteria = { uuid: uuid };
            let update = { numberParticipants: (number + 1) };
            mongodb.updateItem(mongodb.doodleEventDBInfo.dbName, mongodb.doodleEventDBInfo.collectionName, criteria, update).then(data => {
                resolve(data);
            }).catch(err => {
                reject(err);
            });
        });
    });
}

addParticipantToEvent = function (req, res, next) {
    let eventUUID = req.params.uuid;
    let participant = req.body;
    let dates = [];
    let part_id = uuid();

    getDatesByEventIdIntern(eventUUID, data => {
        data.map(el => {
            dates.push({ dateId: el._id, participates: false });
        });
        newParticipant = { _id: part_id, eventUUID: eventUUID, name: participant.name, email: participant.email, dates: dates };
        mongodb.insertIntoCollection(mongodb.doodleParticipantDBInfo.dbName, mongodb.doodleParticipantDBInfo.collectionName, newParticipant);
    });

    getDoodleEventByUUIDIntern(eventUUID, data => {
        console.log(data);
        let participantsOld = data.event.participants;
        participantsOld.push({ participantId: part_id });
        let criteria = { uuid: eventUUID };
        let update = { participants: participantsOld };
        mongodb.updateItem(mongodb.doodleEventDBInfo.dbName, mongodb.doodleEventDBInfo.collectionName, criteria, update);
    });
    incrementNumberParticipants(eventUUID).then(data => {
        // 
    });


}

module.exports = {
    getAllParticipatesIntern: getAllParticipatesIntern,
    getParticipantById: getParticipantById,
    getParticipantByUUID: getParticipantByUUID,
    incrementNumberParticipants: incrementNumberParticipants,
    getNumberOfParticipants: getNumberOfParticipants,
    addParticipantToEvent: addParticipantToEvent
}