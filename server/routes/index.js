var express = require('express');
var router = express.Router();
var dbUtils = require('./../MongoDB/dbUtils');
var eventLogic = require('./../logic/event/doodleEventLogic.js');
var dateLogic = require('./../logic/date/dateLogic');
var participantLogic = require('./../logic/participant/participantLogic');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


// ########################################################
// event routes
// ########################################################
/**
 * create a new event UPDATED
 */
router.post('/event/new', eventLogic.saveNewDoodleEvent);

/**
 * delete an event if you are the creator UPDATED
 */
router.post('/event/delete/:creatorUUID', eventLogic.deleteEvent);

/**
 * get an event by its uuid or the creator uuid UPDATED
 */
router.get('/event/:uuid', eventLogic.getDoodleEventDataByUUID);

/**
 * update title, description, eventType, location of an event UPDATED
 */
router.post('/event/update/:creatorUUID', eventLogic.updateDoodleEvent);


// ########################################################
// participant routes
// ########################################################
/**
 * add one participant to an event with this uuid UPDATED
 */
router.post('/participant/:uuid', participantLogic.addParticipantToEvent);

/**
 * delete a participator of an event UPDATED
 */
router.post('/participant/remove/:adminUUID', participantLogic.removeParticipants);


// ########################################################
// date routes
// ########################################################
/**
 * add dates to an event if you are the creator UPDATED
 */
router.post('/date/add/:adminUUID', dateLogic.addDatesToEvent);

/**
 * update dates of an event if you are the creator
 */
// router.post('/date/update/:creatorUUID', dateLogic.updateExistingDate);

/**
 * delete dates of an event if you are the creator UPDATED
 */
router.post('/date/delete/:adminUUID', dateLogic.removeDatesOfEvent);

/**
 * add a date to a participant
 */
// router.post('/date/participant/add', dateLogic.addDateToParticipant);

/**
 * remove a date from a participant
 */
// router.post('/date/participant/remove', dateLogic.removeDateFromParticipant);




// TODO




// TEST


module.exports = router;
