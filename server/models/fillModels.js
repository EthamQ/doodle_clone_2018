// if key is in allowed keys then assing value to modelToFill
exports.fillModelProperty = function(allowedKeys, modelToFill, key, value,){
        if(allowedKeys.indexOf(key) != -1){
            console.log("fill " + key + "with the value " + value);
            modelToFill[key] = value;
        }    

      
}

exports.fillModelProperty2 = function(allowedKeys, modelToFill, key, value,){
    return new Promise((resolve, reject)=>{
        if(allowedKeys.indexOf(key) != -1){
            console.log("fill " + key + "with the value " + value);
            modelToFill[key] = value;
        }    
        resolve(modelToFill);
    });
      
}