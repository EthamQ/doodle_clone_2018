
const successHelper = require('./../general/successTest');
let chai;
let should;
let expect;

initChai = function(chaiToPass, shouldToPass, expectToPass){
    chai = chaiToPass;
    should = shouldToPass;
    expect = expectToPass;
    successHelper.initChai(chaiToPass, shouldToPass, expectToPass);
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
    // location
    event.should.have.property('location');
    let location = event.location;
    location.should.be.a('string');
    // description
    event.should.have.property('description');
  
    event.should.have.property('eventType');
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

  module.exports = {
    initChai: initChai,
    checkEventProperties: checkEventProperties,
    successHelper: successHelper
  }