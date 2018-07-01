
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

// ############################################
// Create event
// ############################################
console.log('============================================================');
describe('Create a new event', () => {
  it('Success true and should return the object that was saved in the event collection', (done) => {
    chai.request(server)
      .post('/event/new')
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
      .get('/event/' + valueTracker.getUUID())
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
      .get('/event/' + valueTracker.getAdminUUID())
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
      .post('/participant/' + valueTracker.getUUID())
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
describe("Add dates from an event to a participant", ()=>{
  it("Should get success true from the server", done=>{
    GET_eventByUUID(server, valueTracker.getUUID(), response => {
      checkSuccess(response, () => {
        let partToAddTo = extractParticipants(response)[indexParticipantToUpdate];
        chai.request(server)
        .post(urlAddDateToPart + valueTracker.getAdminUUID())
        .send(partMock.getAddDatesMockWithPartId(partToAddTo.id))
        .end((err, res)=>{
          checkSuccess(response, () => {
            valueTracker.setMockDatesForPart(getAddDatesMockWithPartId(partToAddTo.id));
            done();
          });
        });
      });
    });
  });
  it("Boolean array of the participant should be updated correctly", done=>{
    GET_eventByUUID(server, valueTracker.getUUID(), response => {
      checkSuccess(response, () => {
        let updatedParticipant = extractParticipants(response)[indexParticipantToUpdate];
        let indexesToBeTrue = valueTracker.getMockDatesForPart().dateIndexToAdd;
        indexesToBeTrue.map(index =>{
          expect(updatedParticipant.dates[index]).to.be.true;
        });
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
