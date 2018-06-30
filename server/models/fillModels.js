/**
 * if key is in allowed keys then assing value to modelToFill
 * @param {*} allowedKeys 
 * @param {*} modelToFill 
 * @param {*} object 
 * @param {*} callback 
 */
exports.fillModelProperty = function(allowedKeys, modelToFill, object, callback){
    for (let key in object) {
        if(allowedKeys.indexOf(key) != -1){
            if(object[key]){
                modelToFill[key] = object[key];
            }
            else{
                modelToFill[key] = '';
            }
        }    
     }  
     callback(modelToFill);
}