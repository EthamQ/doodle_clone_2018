let newParticipant = {
	"name": "Sinksar",
	"email": "SinksarKingz@web.de",
    "dates": [true, false]
}



getReqMockData_DatesToAdd = function(participantId){
    let addDatesBody = {
        "participantId": participantId,
        "dateIndexToAdd": [1]
    }
    return addDatesBody;
}

getReqMockData_DatesToRemove = function(participantId){
    let addDatesBody = {
        "participantId": participantId,
        "dateIndexToRemove": [1]
    }
    return addDatesBody;
}

getReqMockData_ParticipantRemove = function(idArray){
    return {participantIdArray: idArray};
}

module.exports = {
    newParticipant: newParticipant,
    getReqMockData_DatesToAdd: getReqMockData_DatesToAdd,
    getReqMockData_DatesToRemove: getReqMockData_DatesToRemove,
    getReqMockData_ParticipantRemove: getReqMockData_ParticipantRemove,
}