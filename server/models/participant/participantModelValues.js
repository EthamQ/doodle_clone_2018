const dbUtils = require('./../../MongoDB/dbUtils');

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

exports.requiredKeys = []
exports.dbInfo = null;