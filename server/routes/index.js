var express = require('express');
var router = express.Router();
var dbUtils = require('./../MongoDB/dbUtils');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/allEvents', function(req, res, next) {
  let dbInfo = dbUtils.taskDBInfo;
  res.setHeader('Content-Type', 'application/json');
  dbUtils.getAllItems(dbInfo.dbName, dbInfo.collectionName, res);
  
  
});

router.post('/addTask', function(req, res, next){
  let dbInfo = dbUtils.taskDBInfo;
  dbUtils.insertIntoCollection(dbInfo.dbName, dbInfo.collectionName, req.body);
});

router.post('/removeItem', function(req, res, next) {
  let dbInfo = dbUtils.taskDBInfo;
  res.setHeader('Content-Type', 'application/json');
  let id = req.body.id;
  dbUtils.deleteItemWithId(dbInfo.dbName, dbInfo.collectionName, id);
});

router.post('/updateItem', function(req, res, next) {
  let dbInfo = dbUtils.taskDBInfo;
  res.setHeader('Content-Type', 'application/json');
  let id = req.body.id;
  let updatedItem = req.body.task;
  dbUtils.updateItemWithId(dbInfo.dbName, dbInfo.collectionName, id, updatedItem);
});

module.exports = router;
