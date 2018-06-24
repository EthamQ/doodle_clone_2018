exports.model = {
    _id: null,
    eventUUID: null,
    name: null,
    email: null,
    dates: []
}

exports.getNewModel = function(){
    let model = {
        _id: null,
        eventUUID: null,
        name: null,
        email: null,
        dates: []
    }
    return model
}

exports.allowedKeys = [
    'name',
    'email',
]

exports.requiredKeys = [
    'email'
]

const dbUtils = require('./../../MongoDB/dbUtils');
exports.dbInfo = null;