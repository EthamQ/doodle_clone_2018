var mongodb = require('./../MongoDB/dbUtils');
const participantLogic = require('./participantLogic');

// callback function returns the event and success boolean
getAllDatesIntern = function (callback) {
    // console.log("alldates");
    mongodb.getAllItems(mongodb.doodleDateDBInfo.dbName, mongodb.doodleDateDBInfo.collectionName).then(data => {
        if (data.success) {
            callback({ data });
        }
    });
}

getDatesByEventIdIntern = function (eventId, callback) {
    // console.log("alldates");
    mongodb.getAllItems(mongodb.doodleDateDBInfo.dbName, mongodb.doodleDateDBInfo.collectionName).then(data => {
        if (data.success) {
            // console.log(data.data);
            let eventsWithEventId = data.data.filter(el => el.uuid == eventId);
            callback(eventsWithEventId);
        }
    });
}

// sets date with date id true in dates array of an participant
addDateToExistingParticipant = function (req, res, next) {
    let partId = req.body.participantId;
    let dateId = req.body.dateId;
    getParticipantById(partId, data => {
        let newDatesArray = data.dates;
        newDatesArray.map(date => {
            if (date.dateId === dateId) {
                date.participates = true;
                // update array in database
                let criteria = { _id: partId };
                let update = { dates: newDatesArray };
                mongodb.updateItem(mongodb.doodleParticipantDBInfo.dbName, mongodb.doodleParticipantDBInfo.collectionName, criteria, update);
            }
        })
    });
}



module.exports = {
    getAllDatesIntern: getAllDatesIntern,
    getDatesByEventIdIntern: getDatesByEventIdIntern,
    addDateToExistingParticipant: addDateToExistingParticipant
}