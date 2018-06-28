exports.model = {
    name: null,
    email: null,
    dates: []
}

exports.getNewModel = function(){
    let model = {
        id: null,
        name: null,
        email: null,
        dates: []
    }
    return model
}

exports.allowedKeys = [
    'name',
    'email',
    'dates'
]

exports.requiredKeys = [
    'email'
]

const dbUtils = require('./../../MongoDB/dbUtils');
exports.dbInfo = null;