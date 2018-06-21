const dbUtils = require('./../../MongoDB/dbUtils');

exports.model = {
    title: null,
    description: null,
    isActive: true,
    eventType: null,
    location: null,
    numberParticipants: 0,
    // participants: [], //instanceof doodleParticipantModel()
    // date: [], //instanceof doodleDateModel()
    uuid: null,
    url: 'http://doodleEvent/',
    timestamp: null,
};
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