var express = require('express');
var router = express.Router();
var dbUtils = require('./../MongoDB/dbUtils');
var logic = require('./../logic/doodleEventLogic.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/newDoodleEvent', logic.createNewDoodleEvent);
router.get('/doodleEvent/:uuid', logic.getDoodleEventByUUID);
router.post('/participant/:uuid', logic.addNewParticipant);







// router.get('/allEvents', function(req, res, next) {
//   let dbInfo = dbUtils.taskDBInfo;
//   res.setHeader('Content-Type', 'application/json');
//   dbUtils.getAllItems(dbInfo.dbName, dbInfo.collectionName, res);
  
  
// });

// router.post('/newDoodleEvent', function(req, res, next){
//   console.log("create new doodle event post request received");
//   let dbInfo = dbUtils.taskDBInfo;
//   logic.createNewDoodleEvent(req.body);
//   // dbUtils.insertIntoCollection(dbInfo.dbName, dbInfo.collectionName, req.body);
// });



// router.post('/removeItem', function(req, res, next) {
//   let dbInfo = dbUtils.taskDBInfo;
//   res.setHeader('Content-Type', 'application/json');
//   let id = req.body.id;
//   dbUtils.deleteItemWithId(dbInfo.dbName, dbInfo.collectionName, id);
// });

// router.post('/updateItem', function(req, res, next) {
//   let dbInfo = dbUtils.taskDBInfo;
//   res.setHeader('Content-Type', 'application/json');
//   let id = req.body.id;
//   let updatedItem = req.body.task;
//   dbUtils.updateItemWithId(dbInfo.dbName, dbInfo.collectionName, id, updatedItem);
// });

module.exports = router;
