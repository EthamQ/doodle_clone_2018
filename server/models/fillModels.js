// if key is in allowed keys then assing value to modelToFill
exports.fillModelProperty = function(allowedKeys, modelToFill, key, value){
    if(allowedKeys.indexOf(key) != -1){
        modelToFill[key] = value;
    }      
}