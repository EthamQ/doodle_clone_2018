const dbUtils = require('./../../MongoDB/dbUtils');

exports.getNewModel = function(){
    let model = {
        _id: null,
        title: null,
        description: null,
        isActive: true,
        eventType: null,
        location: null,
        creator: null,
        participants: [], //instanceof participantModel()
        date: [], //instanceof dateModel()
        uuid: null,
        url: 'http://doodleEvent/',
        timestamp: null,
    };
    return model; 
}

// all keys the user is allowed to set directly with a request
exports.allowedKeys = [
    'title',
    'description',
    'location',
    'eventType',
]

exports.requiredKeys = [
    'title'
]

exports.dbInfo = dbUtils.doodleEventDBInfo;