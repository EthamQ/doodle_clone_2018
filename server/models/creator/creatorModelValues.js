const dbUtils = require('./../../MongoDB/dbUtils');

exports.getNewModel = function(){
    let model = {
        adminUUID: null,
        name: null,
        email: null,
        dates: []
    }
    return model;
}

exports.allowedKeys = [
    'name',
    'email',
    'dates'
]

exports.requiredKeys = []
exports.dbInfo = null;