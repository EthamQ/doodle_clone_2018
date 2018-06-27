Routes and how to use them:
##############################################

Overview:
1. Creating a new loodle event
router.post('/event/new', logic.createNewDoodleEvent);
2. Add a participant to an event:
router.post('/participant/:uuid', logic.addParticipantToEvent);
3. Add a date from an event to a participant:
router.post('/date/participant/add', dateLogic.addDateToParticipant);
4. Get a doodle event by its uuid
router.get('/event/:uuid', logic.getDoodleEventByUUID);
5. Update title, description, eventType, location of an event if you are the creator of an event
router.post('/event/update/:creatorUUID', logic.updateDoodleEvent);
6. Add one or multiple dates to an event if you are the creator
router.post('/date/add/:creatorUUID', dateLogic.addDatesToExistingEvent);
7. Update dates of an event if you are the creator
router.post('/date/add/:creatorUUID', dateLogic.addDatesToExistingEvent);
8. Delete a date with its dateId of an event if you are the creator
router.post('/date/delete/:creatorUUID', dateLogic.deleteDatesFromEvent);
9. delete an event if you are the creator
router.post('/event/delete/:creatorUUID', logic.deleteEvent);
10. Remove a date from a participant:
router.post('/date/participant/remove', dateLogic.removeDateFromParticipant);
11. Delete a participator of an event
router.post('/participant/remove/:eventUUID', participantLogic.removeParticipant);

##############################################
1. Creating a new loodle event
router.post('/event/new', logic.createNewDoodleEvent);
Expected data about the new event in the post request:
{
	"title": string,
    "location": string,
    "description": string,
    "eventType": string,
    "creator": {
        "name": string,
	    "email": string
    },
    "date": [
    	{
    	"date": string,
        "timeFrom": string,
        "timeTo": string
    	}
    ]
}

##############################################
2. Add a participant to an event:
router.post('/participant/:uuid', logic.addParticipantToEvent);
Expected data about the new participator in the post request:
{
	"name": string,
	"email": string
}
Expected data in the url: 
/:uuid 
the uuid of the event

Response from the server:

##############################################
3. Add a date from an event to a participant:
router.post('/date/participant/add', dateLogic.addDateToParticipant);
Expected data about the date and participant in the post request:
{
    "participantId": string,
    "dateId": string
}

##############################################
4. Get a doodle event by its uuid
router.get('/event/:uuid', logic.getDoodleEventByUUID);
Expected data about the event in the url:
/:uuid
uuid of the event or uuid from the creator

Response from the server:
Success:
{
    "success": true,
    "message": "Event with the UUID found",
    "data": [
        {
            "creatorAccess": boolean,
            "title": string,
            "description": string,
            "isActive": true,
            "eventType": string,
            "location": string,
            "numberParticipants": number,
            "creator": {
                "name": string,
                "email": string
            },
            "participants": [
                {
                    "participantId": string,
                    "name": string,
                    "email": string,
                    "dates": [
                        {
                            "dateId": string,
                            "participates": boolean
                        }
                    ]
                }
            ],
            "dates": [
                {
                    "dateId": string,
                    "date": string,
                    "timeFrom": string,
                    "timeTo": string
                },
            ],
            "uuid": string,
            "url": string,
            "timestamp": string
        }
    ]
}

##############################################
5. Update title, description, eventType, location of an event if you are the creator of an event
router.post('/event/update/:creatorUUID', logic.updateDoodleEvent);
Expected data in the url:
/:creatorUUID:
the uuid of the creator, so only he can update those values

Expected data in the post request:
{
	"title": string,
    "location": string,
    "description": string,
    "eventType": string
}

##############################################
6. Add one or multiple dates to an event if you are the creator
router.post('/date/add/:creatorUUID', dateLogic.addDatesToExistingEvent);
Expected data in the url:
/:creatorUUID:
the uuid of the creator, so only he can update those values

Expected data in the post request:
{
	"dates":[
		{
			"date": string,
			"timeFrom": string,
			"timeTo": string
        }
		]
}

##############################################
7. Update dates of an event if you are the creator
router.post('/date/update/:creatorUUID', dateLogic.updateExistingDate);

Expected data in the url:
/:creatorUUID:
the uuid of the creator, so only he can update those values

Expected data in the post request:
{
	"dateId": string,
	"date":{
		"date": string,
		"timeFrom": string,
		"timeTo": string
	}
}

##############################################
8. Delete a date with its dateId of an event if you are the creator
router.post('/date/delete/:creatorUUID', dateLogic.deleteDatesFromEvent);

Expected data in the url:
/:creatorUUID:
the uuid of the creator, so only he can update those values

Expected data in the post request:
{
	"dateId": string
}

##############################################
9. delete an event if you are the creator
router.post('/event/delete/:creatorUUID', logic.deleteEvent);

Expected data in the url:
/:creatorUUID:
the uuid of the creator, so only he can update those values

Expected data in the post request: => empty
{ 

}

##############################################
10. Remove a date from a participant:
router.post('/date/participant/remove', dateLogic.removeDateFromParticipant);

Expected data about the date and participant in the post request:
{
    "participantId": string,
    "dateId": string
}

##############################################
11. Delete a participator of an event
router.post('/participant/remove/:eventUUID', participantLogic.removeParticipant);

Expected data in the url:
/:eventUUID:
the uuid of the event

Expected data about the participant in the post request:
{
    "participantId": string,
}