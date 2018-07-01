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

module.exports = {
    newEvent: newEvent
}