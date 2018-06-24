var mongodb = require('./../MongoDB/dbUtils');
const participantLogic = require('./participantLogic');
var ResponseBuilder = require('./responseBuilder');

/**
 * return all dates in the date collection in a callback
 */
getAllDatesIntern = function (callback) {
    mongodb.getAllItems(mongodb.doodleDateDBInfo.dbName, mongodb.doodleDateDBInfo.collectionName).then(data => {
        if (data.success) {
            callback({ data });
        }
    }).catch(err => {
        callback({ data: null, success: false });
    });
}

/**
 * return the event with the specified eventId in a callback
 * an event has an identical _id and uuid
 */
getDatesByEventId = function (eventId, callback) {
    mongodb.getAllItems(mongodb.doodleDateDBInfo.dbName, mongodb.doodleDateDBInfo.collectionName).then(data => {
        if (data.success) {
            let eventsWithEventId = data.data.filter(el => el.uuid == eventId);
            callback(eventsWithEventId);
        }
    });
}

/**
 * called by the route POST '/participant/add/date'
 * a participant has an array with all dates of the event he takes part
 * sets the 'participates' value of the date boolean to true
 * expects from the POST request: {participantId, dateId}
 */
addDateToExistingParticipant = function (req, res, next) {
    let responseBuilder = new ResponseBuilder();
    let partId = req.body.participantId;
    let dateId = req.body.dateId;
    getParticipantById(partId, data => {
        if (data == null) {
            responseBuilder.setSuccess(false);
            responseBuilder.setMessage("A participant with the id wasn't found");
            res.send(responseBuilder.getResponse());
        }
        else {
            let newDatesArray = data.data.dates;
            newDatesArray.map(date => {
                if (date.dateId === dateId) {
                    date.participates = true;
                    // update array in database
                    let criteria = { _id: partId };
                    let update = { dates: newDatesArray };
                    mongodb.updateItem(mongodb.doodleParticipantDBInfo.dbName, mongodb.doodleParticipantDBInfo.collectionName, criteria, update)
                        .then(data => {
                            if (data.success) {
                                responseBuilder.setSuccess(true);
                                responseBuilder.setMessage(responseBuilder.getDateAddedToParticipantSuccessMsg());
                                res.send(responseBuilder.getResponse());
                            }
                        }).catch(err => {
                            responseBuilder.setSuccess(false);
                            responseBuilder.setMessage(responseBuilder.getDatabaseFailureMsg());
                            res.send(responseBuilder.getResponse());
                        });
                }
            })
        }
    });
}

module.exports = {
    getAllDatesIntern: getAllDatesIntern,
    getDatesByEventId: getDatesByEventId,
    addDateToExistingParticipant: addDateToExistingParticipant
}