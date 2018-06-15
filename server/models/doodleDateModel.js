var fillModel = require('./fillModels.js');

module.exports = class DateModel{
    constructor() {
        this.model = {
            date: null,
            timeFrom: null,
            timeTo: null,
        }
        this.allowedKeys = [
            'date',
            'timeFrom',
            'timeTo',
        ]
    }

    getNewDateModel(){
        return this.model;
    }

    setModelProperty(date){
        for(let key in date){
            fillModel.fillModelProperty(this.allowedKeys, this.model, key,  date[key]);
        }
    }
}