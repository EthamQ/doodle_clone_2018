var fillModel = require('./fillModels.js');
var uuid = require('uuid/v4');
module.exports = class doodleEventModel{

    constructor() {
        // define model
        this.model = {
            name: null,
            dateFrom: null,
            dateTo: null,
            eventType: null,
            uuid: null,
            url: 'http://pwp-doodle/'
        };
        // all keys the user is allowed to set with a request
        this.allowedKeys = [
            'name',
            'dateFrom',
            'dateTo',
            'eventType',
        ]
    }
    
    getDoodleEventModel(){
        return this.model;
    }

    // look for the 'key' in this model and assign 'value' to it
    setDoodleEventModelProperty(key, value){
        fillModel.fillModelProperty(this.allowedKeys, this.model, key, value);  
    }

    // generate uuid and add it to url
    setDoodleEventModelUUID(){
        let newUUID = uuid();
        this.model.uuid = newUUID;
        this.model.url += newUUID;
    }
}


