var mongodb = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
let databaseName = "mydb";
var url = "mongodb://localhost:27017/";
const uuid = require('uuid/v4');

// info about the different collection
// to use as input for the database functions
exports.doodleEventDBInfo = {
  dbName: "doodlePWP",
  collectionName: "doodleEvent"
}

/**
 * inserts 'object' into the specified collection
 * @param {*} dbName 
 * @param {*} collectionName 
 * @param {*} object 
 */
exports.insertIntoCollection = function (dbName, collectionName, object) {
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
      if (err) reject(err);
      let dbo = db.db(dbName);
      dbo.collection(collectionName).insertOne(object, function (err, res) {
        if (err) reject(err);
        db.close();
        resolve({ savedItem: object });
      });
    });
  });
}

/**
 * get all items from the specified collection
 */
exports.getAllItems = function (dbName, collectionName) {
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
      if (err) reject(err);
      var dbo = db.db(dbName);
      if (err) reject(err);
      dbo.collection(collectionName).find().toArray(function (err, items) {
        if (err) reject(err);
        resolve({ data: items, success: true });
        db.close();
      });
    });
  });
}

/**
 * get one item from the specified collection with the specified _id attribute
 * @param {*} dbName 
 * @param {*} collectionName 
 * @param {*} id 
 */
exports.getItemById = function (dbName, collectionName, id) {
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
      if (err) reject(err);
      var dbo = db.db(dbName);
      if (err) reject(err);
      dbo.collection(collectionName).findOne({ _id: id }, function (err, result) {
        if (err) reject(err);
        resolve({ data: result });
        db.close();
      });
    });
  });
}

exports.getOneItemBy = function (dbName, collectionName, criteria) {
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
      if (err) reject(err);
      var dbo = db.db(dbName);
      if (err) reject(err);
      dbo.collection(collectionName).findOne(criteria, function (err, result) {
        if (err) reject(err);
        resolve({ data: result, success: true });
        db.close();
      });
    });
  });
}

/**
 * update one item in the specified collection
 * @param {*} dbName 
 * @param {*} collectionName 
 * @param {*} criteria expects following object: {attributeToLookFor: AttributeValueToLookFor}
 * @param {*} update expects following object: {attributeYouWantToChange: newValue}
 */
exports.updateItem = function (dbName, collectionName, criteria, update) {
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
      if (err) reject(err);
      let dbo = db.db(dbName);
      if (err) reject(err);
      let mongodb = require('mongodb');
      let updateInformation = { $set: update };
      dbo.collection(collectionName).update(criteria, updateInformation, { w: 1 },
        function (err, result) {
          if (err) reject(err);
          resolve();
        });
    });
  });
}

exports.updateItemInEventCollection = function (criteria, update) {
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
      if (err) reject(err);
      let dbo = db.db("doodlePWP");
      if (err) reject(err);
      let mongodb = require('mongodb');
      let updateInformation = { $set: update };
      dbo.collection("doodleEvent").update(criteria, updateInformation, { w: 1 },
        function (err, result) {
          if (err) reject(err);
          resolve();
        });
    });
  });
}

exports.deleteItemWithId = function (dbName, collectionName, _id) {
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
      if (err) reject(err);
      var dbo = db.db(dbName);
      if (err) reject(err);
      var mongodb = require('mongodb');
      dbo.collection(collectionName).remove({ _id: _id }, { w: 1 }, function (err, result) {
        if (err) reject(err);
        resolve();
        db.close();
      });
    });
  });
}

exports.deleteItemWithCriteria = function (dbName, collectionName, criteria) {
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
      if (err) reject(err);
      var dbo = db.db(dbName);
      if (err) reject(err);
      var mongodb = require('mongodb');
      dbo.collection(collectionName).remove(criteria, { w: 1 }, function (err, result) {
        if (err) reject(err);
        console.log("resolve deleteItemWithCriteria");
        resolve();
        db.close();
      });
    });
  });
}






