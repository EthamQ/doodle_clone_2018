
let chai;
let should;
let expect;

initChai = function(chaiToPass, shouldToPass, expectToPass){
    chai = chaiToPass;
    should = shouldToPass;
    expect = expectToPass;
}

compareParticipants = function(mockParticipant, participantsFromEvent, atIndex, done){
    partToComp = participantsFromEvent[atIndex];
    expect(partToComp.name).to.be.equal(mockParticipant.name);
    expect(partToComp.email).to.be.equal(mockParticipant.email);
    expect(partToComp.dates).to.be.eql(mockParticipant.dates);
    done();
}

module.exports = {
    compareParticipants: compareParticipants,
    initChai: initChai,
}