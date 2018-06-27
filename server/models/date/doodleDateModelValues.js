exports.model = {
    _id: null,
    date: null,
    timeFrom: null,
    timeTo: null,
    uuid: null
}

exports.getNewModel = function(){
    let model = {
        date: null,
        timeFrom: null,
        timeTo: null,
    }
    return model; 
}
// all keys the user is allowed to set directly with a request
exports.allowedKeys = [
    'date',
    'timeFrom',
    'timeTo',
]

exports.requiredKeys = [
    'date'
]

const dbUtils = require('./../../MongoDB/dbUtils');
exports.dbInfo = dbUtils.doodleDateDBInfo;