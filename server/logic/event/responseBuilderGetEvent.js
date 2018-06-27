var logic = require('./doodleEventLogic.js');
var mongodb = require('./../../MongoDB/dbUtils');
// to fill the data of the responseBuilder
responseData = {};
// to prevent the that the function gets called twice
// when the reason for this issue is found these booleans can be removed
participantsSet = false;
datesSet = false;

initResponseData = function(){
    participantsSet = false;
    datesSet = false;
    responseData = {
        creatorAccess: false,
        title: "",
        description: "",
        isActive: true,
        eventType: "",
        location: "",
        numberParticipants: 0,
        creator: {
            name: "",
            email: ""
        },
        participants: [],
        dates: [],
        uuid: "",
        url: "",
        timestamp: ""
    }
}

setCreatorAccess = function(boolean){
    responseData.creatorAccess = boolean;
}

addDatesByUUID = function(uuidEvent, callback){
    if(!datesSet){
        datesSet = true;
        logic.getDatesByEventId(uuidEvent, dateArray => {
            processDatesEntry(dateArray, ()=>{
                callback();
            });
        });
    }
}

addParticipantsByUUID = function(uuidEvent, callback){
    if(!participantsSet){
        participantsSet = true;
        logic.getParticipantsByUUID(uuidEvent, data =>{
            if(data.success){
                processParticipantsEntry(data, () =>{
                    callback({success: true});
                });
            }
            else{
                callback({success: false});
            }
        });
    } 
}

addEventDataByUUID = function(uuidEvent, callback){
    getDoodleEventByUUID(uuidEvent, data => {
        addEventData(data.event);
        callback(data.success);
    });
}

processDatesEntry = function(dateArray, callback){
    dateArray.map(date => {
        responseData.dates.push({
            dateId: date._id,
            date: date.date,
            timeFrom: date.timeFrom,
            timeTo: date.timeTo,
        });
    });
    callback();
}

processParticipantsEntry = function(data, callback){
    let participantsArray = data.data;
    participantsArray.map(participant => {
        responseData.participants.push({
            participantId: participant._id,
            name: participant.name,
            email: participant.email,
            dates: participant.dates
        });
    });
    callback();
}

let keys = [
    'location',
    'title',
    'description',
    'eventType',
    'location',
    'numberParticipants',
    'uuid',
    'url',
    'timestamp'
]
    


addEventData = function(eventFromDatabase){
    if(eventFromDatabase){
        responseData.title = eventFromDatabase.title;
        responseData.description = eventFromDatabase.description;
        responseData.eventType = eventFromDatabase.eventType;
        responseData.location = eventFromDatabase.location;
        responseData.numberParticipants = eventFromDatabase.numberParticipants;
        responseData.creator.name = eventFromDatabase.creator.name;
        responseData.creator.email = eventFromDatabase.creator.email;
        responseData.uuid = eventFromDatabase.uuid;
        responseData.url = eventFromDatabase.url;
        responseData.timestamp = eventFromDatabase.timestamp;
    }
}

getResponseData = function(){
    return responseData;
}

module.exports = {
    getResponseData: getResponseData,
    addEventData: addEventData,
    processParticipantsEntry: processParticipantsEntry,
    processDatesEntry: processDatesEntry,
    addDatesByUUID: addDatesByUUID,
    initResponseData: initResponseData,
    setCreatorAccess: setCreatorAccess,
    addParticipantsByUUID: addParticipantsByUUID,
    addEventDataByUUID: addEventDataByUUID
  }
