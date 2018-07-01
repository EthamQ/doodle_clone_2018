let newParticipant = {
	"name": "Sinksar",
	"email": "SinksarKingz@web.de",
    "dates": [true, false]
}



getAddDatesMockWithPartId = function(participantId){
    let addDatesBody = {
        "participantId": participantId,
        "dateIndexToAdd": [1]
    }
    return addDatesBody;
}

module.exports = {
    newParticipant: newParticipant,
    getAddDatesMockWithPartId: getAddDatesMockWithPartId
}