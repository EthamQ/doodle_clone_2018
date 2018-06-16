exports.model = {
    title: null,
    description: null,
    isActive: true,
    eventType: null,
    location: null,
    numberParticipants: 0,
    participants: [], //isModel
    date: [], //isModel
    uuid: null,
    url: 'http://doodleEvent/'
};
// all keys the user is allowed to set directly with a request
exports.allowedKeys = [
    'title',
    'description',
    'location',
    'eventType',
]