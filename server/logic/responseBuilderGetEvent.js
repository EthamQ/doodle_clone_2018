var logic = require('./doodleEventLogic.js');
var mongodb = require('./../MongoDB/dbUtils');
responseData = {};
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

processDatesEntryByUUID = function(uuidEvent){
    if(!datesSet){
        datesSet = true;
        logic.getDatesByEventIdIntern(uuidEvent, dateArray => {
            processDatesEntry(dateArray);
        });
    }
}

processParticipantsEntryByUUID = function(uuidEvent){
    if(!participantsSet){
        participantsSet = true;
        console.log("inside function participants: " + uuidEvent);
        logic.getParticipantByUUID(uuidEvent, partArray =>{
            processParticipantsEntry(partArray);
        });
    } 
}

processEventEntryByUUID = function(uuidEvent, callback){
    getDoodleEventByUUIDIntern(uuidEvent, data => {
        processEventEntry(data.event);
        callback(data.success);
    });
}


processDatesEntry = function(dateArray){
    dateArray.map(date => {
        responseData.dates.push({
            dateId: date._id,
            date: date.date,
            timeFrom: date.timeFrom,
            timeTo: date.timeTo,
        });
    });
}

processParticipantsEntry = function(participantsArray){
    // console.log("inside processParticipantsEntry");
    participantsArray.map(participant => {
        responseData.participants.push({
            participantId: participant._id,
            name: participant.name,
            email: participant.email,
            dates: participant.dates
        });
    });
}

processEventEntry = function(eventFromDatabase){
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
    processEventEntry: processEventEntry,
    processParticipantsEntry: processParticipantsEntry,
    processDatesEntry: processDatesEntry,
    processDatesEntryByUUID: processDatesEntryByUUID,
    initResponseData: initResponseData,
    setCreatorAccess: setCreatorAccess,
    processParticipantsEntryByUUID: processParticipantsEntryByUUID,
    processEventEntryByUUID: processEventEntryByUUID

  }
