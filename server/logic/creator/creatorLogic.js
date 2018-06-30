const mongodb = require('./../../MongoDB/dbUtils');

/**
 * uuid belongs to the event
 * helper functions to easily update the creator in an event
 */
updateCreatorWithUUID = function (uuid, creatorUpdated) {
    return new Promise((resolve, reject) => {
        let criteria = { uuid: uuid };
        let update = { creator: creatorUpdated };
        mongodb.updateItemInEventCollection(criteria, update).then(() => {
            resolve();
        }).catch(err => {
            reject(err);
        });
    });
}

/**
 * called by addDatesToCreator or removeDatesFromCreator
 * with different parameters
 */
addRemoveDatesCreator = function (adminUUID, indexArray, shouldAdd) {
    return new Promise((resolve, reject) => {
        getDoodleEventByCreatorUUID(adminUUID, data => {
            if(data.success){
                let maxAllowedIndex = data.event.date.length - 1;
                let creatorUpdated = data.event.creator;
                let uuid = data.event.uuid;
                indexArray.map(index => {
                    if(index > maxAllowedIndex){
                        resolve({success: false, message: "Maximal allowed index is " + maxAllowedIndex + "!"});
                    }
                    else{
                        creatorUpdated.dates[index] = shouldAdd;
                    }
                });
                updateCreatorWithUUID(uuid, creatorUpdated).then(() => {
                    resolve({success: true});
                }).catch(err => {
                    reject(err);
                });
            }
            else{
                resolve({success: false, message: "Event with this adminUUID not found"});
            }
        });
    });
}

module.exports = {
    addRemoveDatesCreator: addRemoveDatesCreator,
    updateCreatorWithUUID: updateCreatorWithUUID,
}