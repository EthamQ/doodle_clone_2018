var fillModel = require('./fillModels.js');
let dbUtils = require('./../MongoDB/dbUtils');
const uuid = require('uuid/v4');

module.exports = class Model {
    constructor(model, allowedKeys, requiredKeys, dbInfo) {
        this.model = model;
        this.allowedKeys = allowedKeys;
        this.requiredKeys = requiredKeys;
        if(dbInfo){
            this.dbName = dbInfo.dbName;
            this.collectionName = dbInfo.collectionName; 
        }  
        
    }

    getModel(){
        return this.model;
    }


    // set values of properties that aren't models themselves (defined in allowedKeys)
    setModelProperty(object, callback){
                fillModel.fillModelProperty(this.allowedKeys, this.model, object, filledModel =>{
                    this.model = filledModel;
                });
                callback();         
    }
    // implement if child models exist
    setThisAndChildModels(object) { }

    /**
     * returns false is a value from this.requiredKey is empty
     */
    modelIsValid(){
        for(let key in this.model){
            if(this.requiredKeys.indexOf(key) != -1 && this.isEmpty(this.model[key])){
                return false;
            }
        }
        return true;
    }

    isEmpty(value){
        return value == undefined || value == null || value == "" || value == [];
    }

    saveModelInDatabase(){
        // console.log(this.model);
        return new Promise((resolve, reject) =>{
            dbUtils.insertIntoCollection(this.dbName, this.collectionName, this.model).then(data =>{
                resolve(data);   
            }).catch(err =>{
                console.log(err);
                reject(err);
            });
        });
    }

    setId(id){
        this.model.id = uuid();
    }

   
}