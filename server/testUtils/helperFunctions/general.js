
let chai;
let should;
let expect;

initChai = function(chaiToPass, shouldToPass, expectToPass){
    chai = chaiToPass;
    should = shouldToPass;
    expect = expectToPass;
}

expectFailure = function (res, done) {
    expect(res.body.success).to.be.false;
    done();
  }

checkSuccess = function (res, done) {
    res.body.should.be.a('object');
    expect(res.body.success).to.be.true;
    res.should.have.status(200);
    done();
  }
  
  module.exports = {
    initChai: initChai,
    expectFailure: expectFailure,
    checkSuccess: checkSuccess,
  }