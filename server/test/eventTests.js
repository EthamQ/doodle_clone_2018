
// chai
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('./../app');
const should = chai.should();
const expect = chai.expect;
chai.use(chaiHttp);

// Custom test data and functions
const createEvent = require('./../testUtils/event/mockData');
const ValueTracker = require('./../testUtils/event/valueTracker');
const helperFct = require('./../testUtils/helperFunctions/event/propertiesTest');
helperFct.initChai(chai, should, expect);
let valueTracker = new ValueTracker();

// ############################################
// Create event
// ############################################
console.log('============================================================');
describe('Create a new event', () => {
  it('should successfully return the object that was saved in the event collection', (done) => {
    chai.request(server)
      .post('/event/new')
      .send(createEvent.newEvent)
      .end((err, res) => {
        expect(res.body.success).to.be.true;
        expect(res.body.messages[0]).to.be.equal('New doodle Event successfully created');
        expect(res.body.data.length).to.be.greaterThan(0);
        let event = res.body.data[0];
        valueTracker.setUUID(event.uuid);
        valueTracker.setAdminUUID(event.creator.adminUUID);
        done();
      });
  });
});

// ############################################
// Get event normal
// ############################################
describe('Get an event with the event uuid', () => {
  it('should successfully return an event with all properties', (done) => {
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
  it('should successfully return an event with all properties', (done) => {
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
        expectFailure(res, ()=>{
          done();
        })
      });
  });
});
