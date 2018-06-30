let mongoose = require("mongoose");
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('./../app');
let should = chai.should();
var expect = chai.expect;

chai.use(chaiHttp);

// describe('/GET example', () => {
//     it('it should get hello world!', (done) => {
//       chai.request(server)
//           .get('/example')
//           .end((err, res) => {
//               res.should.have.status(200);
//               res.body.a.should.be.equal("hello world!");
//             done();
//           });
//     });
// });


describe('/GET event/:uuid', () => {
  let response;
  let event;
  it('should return an event with all properties', (done) => {
    chai.request(server)
      .get('/event/1a050bf5-c920-4be5-b7e8-26158aca1e2c')
      .end((err, res) => {
        response = res;
        // general
        response.should.have.status(200);
        res.body.should.be.a('object');
        event = res.body.data[0];
        
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
      });
  });

  it("should have the correct values for normal access", done=>{
        expect(event.adminAccess).to.be.false;
        event.creator.should.not.have.property('adminUUID');
    done();
  })
});
