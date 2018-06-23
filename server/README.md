Routes and how to use them:

##############################################
Creating a new loodle event
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
    	},
    ]
}

Response from the server:

##############################################
Add a participant to an event:
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
Add a date from an event to a participant:
router.post('/participant/date', logic.addDateToExistingParticipant);
Expected data about the date and participant in the post request:
{
    "participantId": string,
    "dateId": string
}

Response from the server:


##############################################
Get a doodle event by its uuid
router.get('/event/:uuid', logic.getDoodleEventByUUID);
Expected data about the event in the url:
/:uuid
uuid of the event

Response from the server:
Success:
{
    "success": true,
    "message": "Event with the UUID found",
    "data": [
        {
            "_id": string,
            "title": string,
            "description": string,
            "isActive": boolean,
            "eventType": string,
            "location": string,
            "numberParticipants": number,
            "creator": {
                "name": string,
                "email": string,
                "creatorEventUUID": string //will be hidden later
            },
            "participants": [
                {
                    "_id": string, //participantId
                    "eventUUID": string, //will be removed later
                    "name": string,
                    "email": string,
                }
            ],
            "date": [
                {
                    "_id": string, //dateId
                    "date": string,
                    "timeFrom": string,
                    "timeTo": string,
                    "uuid": string //of this event, will be removed later
                }
            ],
            "uuid": "eb60bb8e-4f18-4b01-acea-3b2fc08b9659", //of this event
            "url": "http://doodleEvent/eb60bb8e-4f18-4b01-acea-3b2fc08b9659",
            "timestamp": string
        },
        {
            "creatorAccess": boolean //true if uuid of the creator in url, else false
        }
    ]
}

