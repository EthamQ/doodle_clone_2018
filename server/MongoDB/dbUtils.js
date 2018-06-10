var mongodb = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
let databaseName= "mydb";
var url = "mongodb://localhost:27017/";

exports.taskDBInfo = {
  dbName : "TaskList",
  collectionName : "tasks"
}

exports.createDB = function(dbName){ 
    let urlCreate = url + dbName;
    MongoClient.connect(urlCreate, function(err, db) {
      if (err) throw err;
      console.log("Database created!");
      db.close();
    });
}

exports.createCollection = function(dbName, collectionName){
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("mydb");
            dbo.createCollection(collectionName, function(err, res) {
              if (err) throw err;
              console.log("Collection created!");
              db.close();
            });
          }); 
}

exports.insertIntoCollection = function(dbName, collectionName, object){
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db(dbName);
        dbo.collection(collectionName).insertOne(object, function(err, res) {
          if (err) throw err;
          console.log("1 document inserted");
          db.close();
        });

      }); 
}


exports.getAllTasks = function(dbName, collectionName, res){
  MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db(dbName);
        if (err) throw err;
        // db.close();
        dbo.collection(collectionName).find().toArray(function(err, items) {
          if (err) throw err;
          res.send(items);
          db.close();
        });
     

    }); 
}

exports.deleteTask = function(dbName, collectionName, id){
  console.log("remove start");
  MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db(dbName);
        if (err) throw err;
        console.log("remove connect");
        var mongodb = require('mongodb');
        dbo.collection(collectionName).remove({_id: new mongodb.ObjectID(id)}, {w:1}, function(err, result) {
          if(err) throw err;    
      
          console.log('Document Removed Successfully');
          db.close();
        });
     

    }); 
}


exports.updateTask = function(dbName, collectionName, id, task){
  console.log(id);
  console.log(task);
  console.log("update start");
  MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db(dbName);
        if (err) throw err;
        console.log("update connect");
        var mongodb = require('mongodb');
        dbo.collection(collectionName).update({_id: new mongodb.ObjectID(id)}, { $set: { title: task.title, deadline: task.deadline, priority: task.priority} }, {w:1},
        function(err, result){
                   if(err) throw err;    
                   console.log('Document Updated Successfully');
           });
    }); 
}



