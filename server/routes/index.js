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
 * create a new event
 */
router.post('/event/new', eventLogic.saveNewDoodleEvent);

/**
 * delete an event if you are the creator
 */
router.post('/event/delete/:creatorUUID', eventLogic.deleteEvent);

/**
 * get an event by its uuid or the creator uuid
 */
router.get('/event/:uuid', eventLogic.sendEventDataToClient);

/**
 * update title, description, eventType, location of an event
 */
router.post('/event/update/:creatorUUID', eventLogic.updateDoodleEvent);


// ########################################################
// participant routes
// ########################################################
/**
 * add one participant to an event with this uuid
 */
router.post('/participant/:uuid', participantLogic.addParticipantToEvent);

/**
 * delete a participator of an event
 */
router.post('/participant/remove/:eventUUID', participantLogic.removeParticipant);


// ########################################################
// date routes
// ########################################################
/**
 * add dates to an event if you are the creator
 */
router.post('/date/add/:creatorUUID', dateLogic.addDatesToExistingEvent);

/**
 * update dates of an event if you are the creator
 */
router.post('/date/update/:creatorUUID', dateLogic.updateExistingDate);

/**
 * delete dates of an event if you are the creator
 */
router.post('/date/delete/:creatorUUID', dateLogic.deleteDatesFromEvent);

/**
 * add a date to a participant
 */
router.post('/date/participant/add', dateLogic.addDateToParticipant);

/**
 * remove a date from a participant
 */
router.post('/date/participant/remove', dateLogic.removeDateFromParticipant);




// TODO




// TEST


module.exports = router;
