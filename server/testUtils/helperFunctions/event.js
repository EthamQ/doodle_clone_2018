
const successHelper = require('./general');
const participantHelper = require('./participant');
const dateHelper = require('./date');
const eventMock = require('./../mockData/event');
let chai;
let should;
let expect;

initChai = function(chaiToPass, shouldToPass, expectToPass){
    chai = chaiToPass;
    should = shouldToPass;
    expect = expectToPass;
    successHelper.initChai(chaiToPass, shouldToPass, expectToPass);
    participantHelper.initChai(chaiToPass, shouldToPass, expectToPass);
    dateHelper.initChai(chaiToPass, shouldToPass, expectToPass);
}
 
  checkEventProperties = function (event, done) {
    event.should.not.have.property('_id');
    // boolean properties
    // adminAccess
    event.should.have.property('adminAccess');
    event.adminAccess.should.be.a('boolean');
    // isActive
    event.should.have.property('isActive');
    event.isActive.should.be.a('boolean');
    // string properties
    // title
    event.should.have.property('title');
    let title = event.title;
    title.should.be.a('string');
    expect(title).to.be.equal(eventMock.newEvent.title);
    // location
    event.should.have.property('location');
    let location = event.location;
    location.should.be.a('string');
    expect(location).to.be.equal(eventMock.newEvent.location);
    // description
    event.should.have.property('description');
    let description = event.description;
    description.should.be.a('string');
    expect(description).to.be.equal(eventMock.newEvent.description);
  
    // event type
    event.should.have.property('eventType');
    let eventType = event.eventType;
    eventType.should.be.a('string');
    expect(eventType).to.be.equal(eventMock.newEvent.eventType);

    event.should.have.property('creator');
    event.should.have.property('uuid');
    event.should.have.property('url');
    event.should.have.property('timestamp');
    // array properties
    // participants
    event.should.have.property('participants');
    event.participants.should.be.a('array');
    event.should.have.property('date');
    event.date.should.be.a('array');
  
    // object properties
    done();
  }

  GET_eventByUUID = function(server, uuid, callback){
    chai.request(server)
      .get('/event/' + uuid)
      .end((err, res) => {
        callback(res);
      });
  }

  module.exports = {
    initChai: initChai,
    checkEventProperties: checkEventProperties,
    successHelper: successHelper,
    participantHelper,
    dateHelper,
    GET_eventByUUID: GET_eventByUUID
  }