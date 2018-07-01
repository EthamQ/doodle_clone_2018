
let chai;
let should;
let expect;

initChai = function (chaiToPass, shouldToPass, expectToPass) {
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

extractEvent = function (res) {
  return res.body.data[0];
}
extractDates = function (res) {
  return res.body.data[0].date;
}
extractParticipants = function (res) {
  return res.body.data[0].participants;
}

module.exports = {
  initChai: initChai,
  expectFailure: expectFailure,
  checkSuccess: checkSuccess,
  extractEvent: extractEvent,
  extractDates: extractDates,
  extractParticipants: extractParticipants
}