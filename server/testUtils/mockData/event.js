let newEvent = {
    "title": "Mocha",
    "location": "string",
    "description": "string",
    "eventType": "string",
    "creator": {
        "name": "string",
        "email": "string",
        "dates": [
            true, false
        ]
    },
    "date": [
        {
            "date": 0,
            "timeFrom": 1,
            "timeTo": 2
        },
        {
            "date": 1,
            "timeFrom": 2,
            "timeTo": 3
        }
    ]
}

let updatedEventValues = {
	"title": "updated1",
    "location": "updated2",
    "description": "updated3",
    "eventType": "updated4"
}

module.exports = {
    newEvent: newEvent,
    updatedEventValues: updatedEventValues,
}