const dbUtils = require('./../../MongoDB/dbUtils');

exports.getNewModel = function(){
    let model = {
        id: "",
        name: "",
        email: "",
        dates: []
    }
    return model
}

// all keys the user is allowed to set directly with a request
// with the fillModelProperty function
exports.allowedKeys = [
    'name',
    'email',
    'dates'
]

exports.requiredKeys = []
exports.dbInfo = null;