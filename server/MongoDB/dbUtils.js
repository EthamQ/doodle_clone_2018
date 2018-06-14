var mongodb = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
let databaseName= "mydb";
var url = "mongodb://localhost:27017/";

exports.doodleEventDBInfo = {
  dbName : "doodlePWP",
  collectionName : "doodleEvent"
}

// inserts 'object' into the specified collection
exports.insertIntoCollection = function(dbName, collectionName, object){
  return new Promise((resolve, reject) =>{
    MongoClient.connect(url, function(err, db) {
      if (err) resolve({success: false});
      var dbo = db.db(dbName);
      dbo.collection(collectionName).insertOne(object, function(err, res) {
        if (err) resolve({success: false});
        db.close();
        resolve({success: true});
      });
    }); 
  });
}

// get all item from the specified collection
exports.getAllItems = function(dbName, collectionName){
  return new Promise((resolve, reject) =>{
    MongoClient.connect(url, function(err, db) {
      if (err) resolve({data: null, success: false});
      var dbo = db.db(dbName);
        if (err) resolve({data: null, success: false});
        dbo.collection(collectionName).find().toArray(function(err, items) {
          if (err) resolve({data: null, success: false});
          resolve({data: items, success: true});
          db.close();
        });
    }); 
  });

}

// exports.createDB = function(dbName){ 
//     let urlCreate = url + dbName;
//     MongoClient.connect(urlCreate, function(err, db) {
//       if (err) throw err;
//       console.log("Database created!");
//       db.close();
//     });
// }

// exports.createCollection = function(dbName, collectionName){
//         MongoClient.connect(url, function(err, db) {
//             if (err) throw err;
//             var dbo = db.db(dbName);
//             dbo.createCollection(collectionName, function(err, res) {
//               if (err) throw err;
//               console.log("Collection created!");
//               db.close();
//             });
//           }); 
// }




// exports.getAllItems = function(dbName, collectionName, res){
//   MongoClient.connect(url, function(err, db) {
//       if (err) throw err;
//       var dbo = db.db(dbName);
//         if (err) throw err;
//         // db.close();
//         dbo.collection(collectionName).find().toArray(function(err, items) {
//           if (err) throw err;
//           res.send(items);
//           db.close();
//         });
     

//     }); 
// }

// exports.deleteItemWithId = function(dbName, collectionName, id){
//   MongoClient.connect(url, function(err, db) {
//       if (err) throw err;
//       var dbo = db.db(dbName);
//         if (err) throw err;
//         console.log("remove connect");
//         var mongodb = require('mongodb');
//         dbo.collection(collectionName).remove({_id: new mongodb.ObjectID(id)}, {w:1}, function(err, result) {
//           if(err) throw err;    
//           console.log('Document Removed Successfully');
//           db.close();
//         });
     

//     }); 
// }


// exports.updateItemWithId = function(dbName, collectionName, id, updatedItem){
//   MongoClient.connect(url, function(err, db) {
//       if (err) throw err;
//       let dbo = db.db(dbName);
//         if (err) throw err;
//         let mongodb = require('mongodb');
//         // TODO think of attributes to update
//         dbo.collection(collectionName).update({_id: new mongodb.ObjectID(id)}, { $set: { eventName: updatedItem.title} }, {w:1},
//         function(err, result){
//                    if(err) throw err;    
//                    console.log('Document Updated Successfully');
//            });
//     }); 
// }





