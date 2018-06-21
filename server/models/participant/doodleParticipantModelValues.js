exports.model = {
    name: null,
    email: null,
    isEventCreator: false,
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