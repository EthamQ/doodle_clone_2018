var mongodb = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
let databaseName = "mydb";
var url = "mongodb://localhost:27017/";
const uuid = require('uuid/v4');

exports.doodleEventDBInfo = {
  dbName: "doodlePWP",
  collectionName: "doodleEvent"
}

exports.doodleDateDBInfo = {
  dbName: "doodlePWP",
  collectionName: "doodleDate"
}

exports.doodleParticipantDBInfo = {
  dbName: "doodlePWP",
  collectionName: "doodleParticipants"
}

exports.insertIntoCollection2 = function (dbName, collectionName, object,dbo) {
  return new Promise((resolve, reject) => {
      dbo.collection(collectionName).insertOne(object, function (err, res) {
        if (err) resolve({ success: false });
        db.close();
        // console.log("document inserted");
        if(res){
          // console.log(res.ops[0]._id);
          resolve({ success: true , insertedId: res.ops[0]._id, insertedItem: res.ops[0]});
        }
        // console.log(object);
        
      });
    
  });
}

// inserts 'object' into the specified collection
exports.insertIntoCollection = function (dbName, collectionName, object) {
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
      if (err) throw err;
      
      let dbo = db.db(dbName);
      // console.log(object);
      dbo.collection(collectionName).insertOne(object, function (err, res) {
        if (err) throw err;
        db.close();
        resolve({ success: true , insertedId: object._id});
      });
    });
  });
}



exports.getOneItems = function (dbName, collectionName, id) {
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
      if (err) resolve({ data: null, success: false });
      let dbo = db.db(dbName);
      if (err) resolve({ data: null, success: false });
      dbo.collection(collectionName).find({_id: new mongodb.ObjectID(id)}).toArray(function (err, items) {
        if (err) resolve({ data: null, success: false });
        console.log(items);
        resolve({ data: items, success: true });
        db.close();
      });
    });
  });
}


// get all items from the specified collection
exports.getAllItems = function (dbName, collectionName) {
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
      if (err) resolve({ data: null, success: false });
      var dbo = db.db(dbName);
      if (err) resolve({ data: null, success: false });
      dbo.collection(collectionName).find().toArray(function (err, items) {
        if (err) resolve({ data: null, success: false });
        resolve({ data: items, success: true });
        db.close();
      });
    });
  });
}

getItemByObjectId = function(dbName, collectionName, objectId){
  getAllItems(dbName, collectionName).then(data =>{
    data.data.map(item => {
     console.log(item._id);
    });
  });
}

// TODO: return Promise and success
exports.updateItem = function (dbName, collectionName, criteria, update) {
  return new Promise((resolve, reject)=>{
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
      if (err) resolve({ data: null, success: false });
      let dbo = db.db(dbName);
      if (err) resolve({ data: null, success: false });
      let mongodb = require('mongodb');
      let updateInformation = { $set: update };
      dbo.collection(collectionName).update(criteria, updateInformation, { w: 1 },
        function (err, result) {
          if (err) resolve({ data: null, success: false });
          resolve({ data: null, success: true })
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







