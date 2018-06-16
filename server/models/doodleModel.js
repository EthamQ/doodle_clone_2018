var fillModel = require('./fillModels.js');

module.exports = class Model {
    constructor(model, allowedKeys, requiredKeys) {
        this.model = model;
        this.allowedKeys = allowedKeys;
        this.requiredKeys = requiredKeys;
    }

    getModel(){
        return this.model;
    }

    setModelProperty(object){
        for (let key in object) {
            fillModel.fillModelProperty(this.allowedKeys, this.model, key, object[key]);
        }  
    }

    modelIsValid(){
        console.log(this.requiredKeys);
        for(let key in this.model){
            if(this.requiredKeys.indexOf(key) != -1 && this.isEmpty(this.model[key])){
                return false;
            }
        }
        return true;
    }
}