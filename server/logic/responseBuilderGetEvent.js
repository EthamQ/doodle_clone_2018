const logic = require('./doodleEventLogic');
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
    // logic.getDatesByEventIdIntern(uuidEvent, dateArray => {
    //     processDatesEntry(dateArray);
    // });
    if(!datesSet){
        datesSet = true;
        getDatesByEventIdIntern(uuidEvent, dateArray => {
            processDatesEntry(dateArray);
        });
    }
   
}

processParticipantsEntryByUUID = function(uuidEvent){
    if(!participantsSet){
        participantsSet = true;
        // console.log("inside function participants: " + uuidEvent);
        getParticipantByUUID(uuidEvent, partArray =>{
            processParticipantsEntry(partArray);
        });
    }
   
}

getParticipantByUUID = function(eventUUID, callback){
    let participants = [];
    getAllParticipatesIntern(data =>{
        // console.log(data.data.data);
        let partArray = data.data.data;
        partArray.map(p =>{
            if(p.eventUUID === eventUUID){
                participants.push(p);
            }
        });
        callback(participants);
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
    processParticipantsEntryByUUID: processParticipantsEntryByUUID

  }

// {
//     dateId: "",
//     participates: false
// },

// name: "Raphael",
//             email: "raphael.com",

//             {
//                 _id: "2fdc7525-e86d-48a7-83cc-9450ffccafd0",
//                 eventUUID: "eb60bb8e-4f18-4b01-acea-3b2fc08b9659",
//                 name: "string",
//                 email: "string",
//                 dates: [
                    
//                 ]
//             }



//             {
//                 "_id": "ee978eb4-24be-4331-a867-4e1b04b3755b",
//                 "date": "12.5.18",
//                 "timeFrom": "10:00",
//                 "timeTo": "14:00",
//                 "uuid": "eb60bb8e-4f18-4b01-acea-3b2fc08b9659"
//             },
//             {
//                 "_id": "ca3a44ba-3f97-4cf5-b222-35642b66eb83",
//                 "date": "10.5.18",
//                 "timeFrom": "12:00",
//                 "timeTo": "14:00",
//                 "uuid": "eb60bb8e-4f18-4b01-acea-3b2fc08b9659"
//             }