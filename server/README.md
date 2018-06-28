Routes and how to use them:
##############################################

Overview:
1. Creating a new loodle event UPDATED
router.post('/event/new', logic.createNewDoodleEvent);
2. Add a participant to an event: UPDATED
router.post('/participant/:uuid', logic.addParticipantToEvent);
3. Add a date from an event to a participant: UPDATED
router.post('/date/participant/add/:adminUUID', dateLogic.addDatesToParticipant);
4. Get a doodle event by its uuid UPDATED
router.get('/event/:uuid', logic.getDoodleEventByUUID);
5. Update title, description, eventType, location of an event if you are the creator of an event UPDATED
router.post('/event/update/:creatorUUID', logic.updateDoodleEvent);
7. Add dates to an event if you are the creator UPDATED
router.post('/date/add/:adminUUID', dateLogic.addDatesToEvent);
8. Delete dates of an event if you are the creator UPDATED
router.post('/date/delete/:adminUUID', dateLogic.removeDatesOfEvent);
9. delete an event if you are the creator UPDATED
router.post('/event/delete/:creatorUUID', logic.deleteEvent);
10. Remove a date from a participant: UPDATED
router.post('/date/participant/remove/:adminUUID', dateLogic.removeDatesFromParticipant);
11. Delete a participator of an event UPDATED
router.post('/participant/remove/:adminUUID', participantLogic.removeParticipants);

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
	    "email": string,
        "dates":[
            boolean //index corresponds to index in date
        ]
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
	"email": string,
    "dates": [
        boolean //index corresponds to index in date
    ]
}
Expected data in the url: 
/:uuid 
the uuid of the event

##############################################
3. Add a date from an event to a participant:
router.post('/date/participant/add/:adminUUID', dateLogic.addDatesToParticipant);
Expected data about the date and participant in the post request,
send all the indexes of the dates you want to set to true in the dates array
of the partcipant with the corresponding id

Expected data in the url:
/:adminUUID:
the uuid of the creator, so only he can update those values

{
    "participantId": string,
    "dateIndexToAdd": [
        number
    ]
}

##############################################
4. Get a doodle event by its uuid or adminUUID
router.get('/event/:uuid', logic.getDoodleEventByUUID);
Expected data about the event in the url:
/:uuid
uuid of the event or uuid from the creator

Response from the server on success:
{
    "success": true,
    "message": "Event with the UUID found", //if admin access: "Event with the UUID found, admin access"
    "data": [
        {
            "adminAccess": boolean,
            "title": string,
            "description": string,
            "isActive": true,
            "eventType": string,
            "location": string,
            "numberParticipants": number,
            "creator": {
                "name": string,
                "email": string,
                "dates": [
                    boolean //index corresponds to index in date
                ],
                "adminUUID": string //only shown if admin access
            },
            "participants": [
                {
                    "id": string,
                    "name": string,
                    "email": string,
                    "dates": [
                        boolean //index corresponds to index in date
                    ]
                }
            ],
            "date": [
                {
                    "date": number,
                    "timeFrom": number,
                    "timeTo": number
                },
            ],
            "uuid": string,
            "url": string,
            "timestamp": number
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
7. Add dates to an event if you are the creator
router.post('/date/add/:adminUUID', dateLogic.addDatesToEvent);

Expected data in the url:
/:adminUUID:
the uuid of the creator, so only he can update those values

Expected data in the post request:
{
	"datesToAdd":[
        {
        "date": number,
        "timeFrom": number,
        "timeTo": number
        }
    ]
}

##############################################
8. Delete a date of an event if you are the creator
router.post('/date/delete/:adminUUID', dateLogic.removeDatesOfEvent);

Expected data in the url:
/:adminUUID:
the uuid of the creator, so only he can update those values

Expected data in the post request (the indexes of the dates you want to delete int the date array of an event):
{
	"indexesToDelete": [
        boolean
    ]
}

##############################################
9. delete an event if you are the creator
router.post('/event/delete/:creatorUUID', logic.deleteEvent);

Expected data in the url:
/:creatorUUID:
the uuid of the creator, so only he can delete an event

Expected data in the post request: => empty
{ 

}

##############################################
10. Remove a date from an event to a participant:
router.post('/date/participant/add/:adminUUID', dateLogic.addDatesToParticipant);
Expected data about the date and participant in the post request,
send all the indexes of the dates you want to set to false in the dates array
of the partcipant with the corresponding id

Expected data in the url:
/:adminUUID:
the uuid of the creator, so only he can update those values

{
    "participantId": string,
    "dateIndexToRemove": [
        number
    ]
}

##############################################
11. Delete a participator of an event
router.post('/participant/remove/:adminUUID', participantLogic.removeParticipants);

Expected data in the url:
/:adminUUID:
the adminUuid of the event

Expected data in the post request:
A array of participants whose length is lesser than the inital participants array.
Just remove the participant from the array and send it
{
   "participantsUpdated": [
                {
                    "name": string,
                    "email": string,
                    "dates": [
                        boolean //index corresponds to index in date
                    ]
                }
            ]
}