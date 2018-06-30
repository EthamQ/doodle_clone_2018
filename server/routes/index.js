const express = require('express');
const router = express.Router();
const dbUtils = require('./../MongoDB/dbUtils');
const eventRouteLogic = require('./../logic/event/eventRouteLogic.js');
const dateRouteLogic = require('./../logic/date/dateRouteLogic');
const participantRouteLogic = require('./../logic/participant/participantRouteLogic');
const creatorLogic = require('./../logic/creator/creatorRouteLogic');

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
router.post('/event/new', eventRouteLogic.saveNewDoodleEvent);

/**
 * delete an event if you are the creator
 */
router.post('/event/delete/:creatorUUID', eventRouteLogic.deleteEvent);

/**
 * get an event by its uuid or the creator uuid
 */
router.get('/event/:uuid', eventRouteLogic.getDoodleEventDataByUUID);

/**
 * update title, description, eventType, location of an event
 */
router.post('/event/update/:creatorUUID', eventRouteLogic.updateDoodleEvent);


// ########################################################
// participant routes
// ########################################################
/**
 * add one participant to an event with this uuid
 */
router.post('/participant/:uuid', participantRouteLogic.addParticipantToEvent);

/**
 * delete a participator of an event
 */
router.post('/participant/remove/:adminUUID', participantRouteLogic.removeParticipants);

/**
 * add dates to a participant
 */
router.post('/date/participant/add/:adminUUID', participantRouteLogic.addDatesToParticipant);

/**
 * remove dates from a participant
 */
router.post('/date/participant/remove/:adminUUID', participantRouteLogic.removeDatesFromParticipant);

// ########################################################
// date routes
// ########################################################
/**
 * add dates to an event if you are the creator
 */
router.post('/date/add/:adminUUID', dateRouteLogic.addDatesToEvent);

/**
 * delete dates of an event if you are the creator
 */
router.post('/date/delete/:adminUUID', dateRouteLogic.removeDatesOfEvent);

// ########################################################
// creator routes
// ########################################################
/**
 * remove dates from the creator
 */
router.post('creator/date/remove/:adminUUID', creatorLogic.removeDatesFromCreator);

 /**
 * add dates to the creator
 */
router.post('creator/date/add/:adminUUID', creatorLogic.addDatesToCreator);

module.exports = router;
