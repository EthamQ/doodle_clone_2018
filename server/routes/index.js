var express = require('express');
var router = express.Router();
var dbUtils = require('./../MongoDB/dbUtils');
var logic = require('./../logic/doodleEventLogic.js');
var dateLogic = require('./../logic/dateLogic');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/**
 * create a new event
 */
router.post('/event/new', logic.saveNewDoodleEvent);

/**
 * get an event by its uuid
 */
router.get('/event/:uuid', logic.sendEventDataToClient);

/**
 * add one participant to an event with this uuid
 */
router.post('/participant/:uuid', logic.addParticipantToEvent);

/**
 * add a participant to an existing date
 */
router.post('/participant/add/date', logic.addDateToExistingParticipant);

/**
 * update title, description, eventType, location of an event
 */
router.post('/event/update/:creatorUUID', logic.updateDoodleEvent);

/**
 * add dates to an event if you are the creator
 */
router.post('/date/add/:creatorUUID', dateLogic.addDatesToExistingEvent);

/**
 * update dates of an event if you are the creator
 */
router.post('/date/update/:creatorUUID', dateLogic.updateExistingDate);

// TODO
/**
 * delete dates of an event if you are the creator
 */
router.post('/date/delete/:creatorUUID');

/**
 * delete a participator of an event
 */
router.post('/participant/delete/:eventUUID');

/**
 * remove a date from a participant
 */
router.post('/participant/remove/date/:eventUUID');









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
