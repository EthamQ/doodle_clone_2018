var express = require('express');
var router = express.Router();
var dbUtils = require('./../MongoDB/dbUtils');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/allTasks', function(req, res, next) {
  let dbInfo = dbUtils.taskDBInfo;
  res.setHeader('Content-Type', 'application/json');
  dbUtils.getAllTasks(dbInfo.dbName, dbInfo.collectionName, res);
  
  
});




dbName = "TaskList";
collectionName = "tasks";
router.post('/addTask', function(req, res, next){
  res.send("got post");
  console.log(req.body);
  console.log(dbUtils.taskDBInfo);
  let dbInfo = dbUtils.taskDBInfo;
  dbUtils.insertIntoCollection(dbInfo.dbName, dbInfo.collectionName, req.body);
});

router.post('/removeTask', function(req, res, next) {

  let dbInfo = dbUtils.taskDBInfo;
  res.setHeader('Content-Type', 'application/json');
  let id = req.body.id;
  console.log("backend: remove route called");
  console.log(req.body);
  dbUtils.deleteTask(dbInfo.dbName, dbInfo.collectionName, id);
});

router.post('/updateTask', function(req, res, next) {

  let dbInfo = dbUtils.taskDBInfo;
  res.setHeader('Content-Type', 'application/json');
  console.log(req.body);
  let id = req.body.id;
  let newTask = req.body.task;
  console.log("backend: update route called");
  console.log(req.body);
  dbUtils.updateTask(dbInfo.dbName, dbInfo.collectionName, id, newTask);
});

module.exports = router;
