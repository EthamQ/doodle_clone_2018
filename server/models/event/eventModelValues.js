const dbUtils = require('./../../MongoDB/dbUtils');

exports.getNewModel = function(){
    let model = {
        _id: "",
        title: "",
        description: "",
        isActive: true,
        eventType: "",
        location: "",
        creator: null,
        participants: [], //instanceof participantModel()
        date: [], //instanceof dateModel()
        uuid: "",
        url: 'http://doodleEvent/',
        timestamp: null,
    };
    return model; 
}

// all keys the user is allowed to set directly with a request
// with the fillModelProperty function
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