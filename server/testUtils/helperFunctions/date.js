let chai;
let should;
let expect;

initChai = function(chaiToPass, shouldToPass, expectToPass){
    chai = chaiToPass;
    should = shouldToPass;
    expect = expectToPass;
}

updatedDatesAsExpected = function(previousDates, datesAdded, updatedDates, done){
    datesAdded.map(date =>{
        previousDates.push(date);
    });
    let expectedDates = previousDates;
    expect(expectedDates).to.be.eql(updatedDates);
    done();
}

module.exports = {
    updatedDatesAsExpected: updatedDatesAsExpected,
    initChai: initChai,
}