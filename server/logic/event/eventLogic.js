const DoodleEventModel = require('./../../models/event/eventModel');
const DoodleParticipantModel = require('./../../models/participant/participantModel');
const ResponseBuilder = require('./../responseBuilder');
const mongodb = require('./../../MongoDB/dbUtils');
const dbInfo = mongodb.doodleEventDBInfo;
const uuid = require('uuid/v4');
const participantLogic = require('./../participant/participantLogic');
const dateLogic = require('./../date/dateLogic');

/**
 * creates DoodleEventModel() object, fills its values with the values
 * of the request data and then resolves the model object in a promise
 */
prepareNewDoodleEvent = function (req, res, next) {
    return new Promise((resolve, reject) => {
        let doodleEventToSave = new DoodleEventModel();
        let newEvent = req.body;
        doodleEventToSave.generateAndSetRequiredProperties();
        doodleEventToSave.setModelProperty(newEvent, () => {
            doodleEventToSave.setChildModelProperties(newEvent, () => {
                resolve(doodleEventToSave);
            });
        });
    });
}

/**
 * looks for the event with uuid = 'uuidEvent'
 * returns the { event: event, success: true } in a callback on success
 * { event: null, success: false } in a callback on failure
 */
getDoodleEventByUUID = function (uuidEvent, callback) {
    mongodb.getItemById(dbInfo.dbName, dbInfo.collectionName, uuidEvent).then(data => {
        if (data.data != null) {
            callback({ event: data.data, success: true });
        }
        else {
            callback({ event: null, success: false });
        }
    }).catch(err => {
        console.log(err);
        callback({ event: null, success: false });
    });
}

/**
 * looks for the event with creatorUUID = 'uuidCreator'
 * on success: returns { event: event, uuidEvent: event.uuid, success: true } in a callback
 * on failure: returns { event: null, uuidEvent: null, success: false } in a callback
 */
getDoodleEventByCreatorUUID = function (uuidCreator, callback) {
    mongodb.getAllItems(dbInfo.dbName, dbInfo.collectionName).then(data => {
        let arrayAllEvents = data.data;
        // console.log(data.data[0].creator);
        if (arrayAllEvents.length != 0) {
            // look for creator uuid in event
            for (let i = 0; i < arrayAllEvents.length; i++) {
                if (arrayAllEvents[i].creator.adminUUID == uuidCreator) {
                    callback({ event: arrayAllEvents[i], uuidEvent: arrayAllEvents[i].uuid, success: true });
                    break;
                }
                // creator id not found, end of array
                else {
                    if (i === (arrayAllEvents.length - 1)) {
                        callback({ event: null, uuidEvent: null, success: false });
                    }
                }
            }
        }
    }).catch(err => {
        console.log(err);
        callback({ event: null, uuidEvent: null, success: false });
    });
}

module.exports = {
    getDoodleEventByUUID: getDoodleEventByUUID,
    getDoodleEventByCreatorUUID: getDoodleEventByCreatorUUID,
    prepareNewDoodleEvent
}
