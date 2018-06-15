var fillModel = require('./fillModels.js');

module.exports = class Model {
    constructor(model, allowedKeys) {
        this.model = model;
        this.allowedKeys = allowedKeys;
    }

    getModel(){
        return this.model;
    }

    setModelProperty(object){
        for (let key in object) {
            fillModel.fillModelProperty(this.allowedKeys, this.model, key, object[key]);
        }  
    }
}