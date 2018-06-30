const mongodb = require('./../../MongoDB/dbUtils');
const participantLogic = require('./../participant/participantLogic');
const eventLogic = require('./../event/eventLogic');
const ResponseBuilder = require('./../responseBuilder');
const DateModel = require('./../../models/date/dateModel');
const uuid = require('uuid/v4');

/**
 * called by removeDatesOfEvent function
 * deletes dates of the index array in event.date, event.creator.dates
 * and in every participant.dates array
 */
getResponseForRemovingDates = function (indexesToDelete, creatorUUID) {
    return new Promise((resolve, reject)=>{
        getDoodleEventByCreatorUUID(creatorUUID, data => {
           if (data.success) {
               let maxIndexAllowed = data.event.date.length - 1;
               // create copies of dates, participants and creator with empty date arrays
               // which will be filled with the dates we want to keep
               // 1: dates
               let oldDates = data.event.date;
               let updatedDates = [];
               // 2: participants
               let oldParticipants = data.event.participants;
               let updatedParticipants = [];
               for (let i = 0; i < oldParticipants.length; i++) {
                   // complicated like that because else you can't change one array 
                   // without changing the other one
                   let partToPush = {
                       id: oldParticipants[i].id,
                       name: oldParticipants[i].name,
                       email: oldParticipants[i].email,
                       dates: []
                   }
                   updatedParticipants.push(partToPush);
               }
               // 3: creator
               let updatedCreator = data.event.creator;
               let datesUpdatedCreator = [];

               // initialize datesToKeep, boolean array => false means index should be deleted
            let datesToKeep = [];
            // set all to true
            oldDates.map(date => {
                datesToKeep.push(true);
            });
            // set indexes to delete to false
            indexesToDelete.map(index => {
                datesToKeep[index] = false;
                if (index > maxIndexAllowed) {
                    resolve({ success: false, message: "Highest allowed index is " + maxIndexAllowed + "!"});
                }
            });

               // fill empty dates array with values we want to keep
               // indicated by the datesToKeep boolean array
               for (let i = 0; i < oldDates.length; i++) {
                   if (datesToKeep[i]) {
                       // dates
                       updatedDates.push(oldDates[i]);
                       // dates creator
                       datesUpdatedCreator.push(updatedCreator.dates[i]);
                       // dates participants
                       for (let j = 0; j < oldParticipants.length; j++) {
                           let dateToKeep = oldParticipants[j].dates[i];
                           updatedParticipants[j].dates.push(dateToKeep);
                       }
                   }
               }
               updatedCreator.dates = datesUpdatedCreator;
               let criteria = { uuid: data.event.uuid };
               let update = {
                   date: updatedDates,
                   participants: updatedParticipants,
                   creator: updatedCreator
               };
               mongodb.updateItemInEventCollection(criteria, update).then(data => {
                   resolve({ success: true, message: "Date(s) successfully removed"});
               }).catch(err => {
                   resolve({ success: false, message: responseBuilder.getDatabaseFailureMsg()});
               });
           }
           else {
            resolve({ success: false, message: responseBuilder.getDoodleEventByCreatorUUIDFailureMsg()});
           }
       });
    });
}

/**
 * true if the counter reaches the end of the array
 */
isLastIteration = function (counter, array) {
    return counter === (array.length - 1);
}

module.exports = {
    getResponseForRemovingDates: getResponseForRemovingDates,
    isLastIteration: isLastIteration,
}