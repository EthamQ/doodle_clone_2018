// if key is in allowed keys then assing value to modelToFill
// exports.fillModelProperty = function(allowedKeys, modelToFill, key, value,){
//         if(allowedKeys.indexOf(key) != -1){
//             console.log("fill " + key + "with the value " + value);
//             modelToFill[key] = value;
//         }    

      
// }

exports.fillModelProperty = function(allowedKeys, modelToFill, object, callback){
    for (let key in object) {
        if(allowedKeys.indexOf(key) != -1){
            modelToFill[key] = object[key];
        }    
     }  
     callback(modelToFill);
}