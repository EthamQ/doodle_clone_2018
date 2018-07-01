
// chai
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('./../app');
const should = chai.should();
const expect = chai.expect;
chai.use(chaiHttp);

// Custom test data and functions
const eventMock = require('./../testUtils/mockData/event');
const partMock = require('./../testUtils/mockData/participant');
const dateMock = require('./../testUtils/mockData/date');
const ValueTracker = require('./../testUtils/valueTracker');
const helperFct = require('./../testUtils/helperFunctions/event');
helperFct.initChai(chai, should, expect);
let valueTracker = new ValueTracker();

// request urls
let url_newEvent = '/event/new';
let url_getEvent = '/event/';
let url_addParticipant = '/participant/';

// ############################################
// Create event
// ############################################
console.log('============================================================');
describe('Create a new event', () => {
  it('Success true and should return the object that was saved in the event collection', (done) => {
    chai.request(server)
      .post(url_newEvent)
      .send(eventMock.newEvent)
      .end((err, res) => {
        expect(res.body.success).to.be.true;
        expect(res.body.messages[0]).to.be.equal('New doodle Event successfully created');
        expect(res.body.data.length).to.be.greaterThan(0);
        let event = res.body.data[0];
        valueTracker.setUUID(event.uuid);
        valueTracker.setAdminUUID(event.creator.adminUUID);
        valueTracker.initNumberParticipants();
        done();
      });
  });
});

// ############################################
// Get event normal
// ############################################

describe('Get an event with the event uuid', () => {
  it('Success true and should return an event with all properties', (done) => {
    chai.request(server)
      .get(url_getEvent + valueTracker.getUUID())
      .end((err, res) => {
        valueTracker.setEvent(res.body.data[0]);
        checkSuccess(res, () => {
          checkEventProperties(valueTracker.getEvent(), () => {
            done();
          })
        });
      });
  });
  it("should have the correct values for normal access", done => {
    expect(valueTracker.getEvent().adminAccess).to.be.false;
    valueTracker.getCreator().should.not.have.property('adminUUID');
    done();
  })
});

// ############################################
// Get event admin
// ############################################
describe('Get an event with the admin uuid', () => {
  it('Success true and should successfully return an event with all properties', (done) => {
    chai.request(server)
      .get(url_getEvent + valueTracker.getAdminUUID())
      .end((err, res) => {
        valueTracker.setAdminEvent(res.body.data[0]);
        checkSuccess(res, () => {
          checkEventProperties(valueTracker.getAdminEvent(), () => {
            done();
          })
        });
      });
  });
  it("should have the correct values for admin access", done => {
    expect(valueTracker.getAdminEvent().adminAccess).to.be.true;
    valueTracker.getAdminCreator().should.have.property('adminUUID');
    done();
  })
});

// ############################################
// Add participant to event
// ############################################
describe("Add one participant to an event", () => {
  it("Success true and event should now have the participant", done => {
    chai.request(server)
      .post(url_addParticipant + valueTracker.getUUID())
      .send(partMock.newParticipant)
      .end((err, res) => {
        checkSuccess(res, () => {
          valueTracker.incrementParticipants();
          GET_eventByUUID(server, valueTracker.getUUID(), response => {
            checkSuccess(res, () => {
              let mockParticipant = partMock.newParticipant;
              let participantsFromEvent = extractParticipants(response);
              let indexNewParticipant = valueTracker.getIndexNewParticipant();
              expect(participantsFromEvent.length).to.be.equal(valueTracker.getNumberParticipants());
              compareParticipants(mockParticipant, participantsFromEvent, indexNewParticipant, () => {
                done();
              })
            });
          });
        });
      });
  });
});

// ############################################
// Add date to event
// ############################################
describe("Add dates to an event", () => {
  it("Success true and the event should now have the dates", done => {
    chai.request(server)
      .post("/date/add/" + valueTracker.getAdminUUID())
      .send(dateMock.newDates)
      .end((err, res) => {
        checkSuccess(res, () => {
          GET_eventByUUID(server, valueTracker.getUUID(), response => {
            checkSuccess(response, () => {
              let previousDates = valueTracker.getDate().slice();
              let datesAdded = dateMock.newDates.datesToAdd;
              let updatedDates = extractDates(response);
              updatedDatesAsExpected(previousDates, datesAdded, updatedDates, () => {
                done();
              });
            })
          });
        });
      });
  });
});



// ############################################
// Add dates to a participant
// ############################################
// index of the participant in event.participants you want to update
let indexParticipantToUpdate = 0;
let urlAddDateToPart = "/date/participant/add/";
describe("Add dates from an event to a participant", () => {
  it("Should get success true from the server", done => {
    GET_eventByUUID(server, valueTracker.getUUID(), response => {
      checkSuccess(response, () => {
        // get a participant from the event you want to update
        let participantToUpdate = extractParticipants(response)[indexParticipantToUpdate];
        // get mock data from the participant with its id
        let mockRequestData = partMock.getReqMockData_DatesToAdd(participantToUpdate.id);
        // Post request to add date
        chai.request(server)
          .post(urlAddDateToPart + valueTracker.getAdminUUID())
          .send(mockRequestData)
          .end((err, res) => {
            checkSuccess(response, () => {
              // store mock data you sent for later use
              valueTracker.MOCK_setDatesToAddToParticipant((mockRequestData));
              done();
            });
          });
      });
    });
  });
  it("Boolean array of the participant should be updated correctly", done => {
    // get same updated event
    GET_eventByUUID(server, valueTracker.getUUID(), response => {
      checkSuccess(response, () => {
        let updatedParticipant = extractParticipants(response)[indexParticipantToUpdate];
        let indexesToBeTrue = valueTracker.MOCK_getDatesToAddToParticipant().dateIndexToAdd;
        // check if indexes you set true are now actually true
        indexesToBeTrue.map(index => {
          expect(updatedParticipant.dates[index]).to.be.true;
        });
        done();
      });
    });
  });
});

// ############################################
// Delete dates of a participant
// ############################################
let urlRemoveDateFromPart = "/date/participant/remove/";
describe("Add dates from an event to a participant", () => {
  it("Should get success true from the server", done => {
    GET_eventByUUID(server, valueTracker.getUUID(), response => {
      checkSuccess(response, () => {
        // get a participant from the event you want to update
        let participantToUpdate = extractParticipants(response)[indexParticipantToUpdate];
        // get mock data from the participant with its id
        let mockRequestData = partMock.getReqMockData_DatesToRemove(participantToUpdate.id);
        // Post request to remove dates
        chai.request(server)
          .post(urlRemoveDateFromPart + valueTracker.getAdminUUID())
          .send(mockRequestData)
          .end((err, res) => {
            checkSuccess(response, () => {
              // store mock data you sent for later use
              valueTracker.MOCK_setDatesToRemoveFromParticipant(mockRequestData);
              done();
            });
          });
      });
    });
  });
  it("Boolean array of the participant should be updated correctly", done => {
    // get same updated event
    GET_eventByUUID(server, valueTracker.getUUID(), response => {
      checkSuccess(response, () => {
        let updatedParticipant = extractParticipants(response)[indexParticipantToUpdate];
        let indexesToBeFalse = valueTracker.MOCK_getDatesToRemoveFromParticipant().dateIndexToRemove;
        // check if indexes you set false are now actually false
        indexesToBeFalse.map(index => {
          expect(updatedParticipant.dates[index]).to.be.false;
        });
        done();
      });
    });
  });
});


// ############################################
// Update title, description, eventType, location of an event
// ############################################
let urlUpdateEventMainValues = '/event/update/';
describe("Update title, description, eventType, location", () => {
  it("Should get success true from the server", done => {
    let mockRequestData = eventMock.updatedEventValues;
    chai.request(server)
      .post(urlUpdateEventMainValues + valueTracker.getAdminUUID())
      .send(mockRequestData)
      .end((err, res) => {
        checkSuccess(res, () => {
          valueTracker.MOCK_setUpdatedEventValues(mockRequestData);
          done();
        });
      });
  });
  it("The event should now contain the updated title, description, eventType, location", done => {
    // get same event after update
    GET_eventByUUID(server, valueTracker.getUUID(), response => {
      checkSuccess(response, () => {
        // compare event values from mock request with values in database
        let mockValues = valueTracker.MOCK_getUpdatedEventValues();
        let updatedEvent = extractEvent(response);
        expect(updatedEvent.title).to.be.equal(mockValues.title);
        expect(updatedEvent.description).to.be.equal(mockValues.description);
        expect(updatedEvent.eventType).to.be.equal(mockValues.eventType);
        expect(updatedEvent.location).to.be.equal(mockValues.location);
        done();
      });
    });
  });
});












// ############################################
// Delete event
// ############################################
describe('Delete an event', () => {
  it('should successfully delete the event', (done) => {
    chai.request(server)
      .post('/event/delete/' + valueTracker.getAdminUUID())
      .send({})
      .end((err, res) => {
        checkSuccess(res, () => {
          done();
        });
      });
  });
  it('should not find the event anymore', done => {
    chai.request(server)
      .get('/event/' + valueTracker.getUUID())
      .end((err, res) => {
        expectFailure(res, () => {
          done();
        })
      });
  });
});
