const creatorLogic = require('./creatorLogic');

/**
 * called by the router
 * POST 'creator/date/remove/:adminUUID'
 * sets indexes of dates array of creator to true
 */
addDatesToCreator = function (req, res, next) {
    let responseBuilder = new ResponseBuilder();
    let dateIndexToAdd = req.body.dateIndexToAdd;
    let adminUUID = req.params.adminUUID;
    let shouldAdd = true;
    addRemoveDatesCreator(adminUUID, dateIndexToAdd, shouldAdd).then(data => {
        if(data.success){
            responseBuilder.addMessage("Dates successfully added to creator");
            responseBuilder.setSuccess(true);
            res.send(responseBuilder.getResponse());
        }
        else{
            responseBuilder.addMessage(data.message);
            responseBuilder.setSuccess(false);
            res.send(responseBuilder.getResponse());
        }
    }).catch(err => {
        responseBuilder.addMessage(responseBuilder.getDatabaseFailureMsg());
        responseBuilder.addMessage(err.toString());
        responseBuilder.setSuccess(false);
        res.send(responseBuilder.getResponse());
    });
}

/**
 * called by the router
 * POST 'creator/date/remove/:adminUUID'
 * sets indexes of dates array of creator to false
 */
removeDatesFromCreator = function (req, res, next) {
    let responseBuilder = new ResponseBuilder();
    let dateIndexToRemove = req.body.dateIndexToRemove;
    let adminUUID = req.params.adminUUID;
    let shouldAdd = false;
    addRemoveDatesCreator(adminUUID, dateIndexToRemove, shouldAdd).then(data => {
        if(data.success){
            responseBuilder.addMessage("Dates successfully removed from creator");
            responseBuilder.setSuccess(true);
            res.send(responseBuilder.getResponse());
        }
        else{
            responseBuilder.addMessage(data.message);
            responseBuilder.setSuccess(false);
            res.send(responseBuilder.getResponse());
        }
    }).catch(err => {
        responseBuilder.addMessage(responseBuilder.getDatabaseFailureMsg());
        responseBuilder.addMessage(err.toString());
        responseBuilder.setSuccess(false);
        res.send(responseBuilder.getResponse());
    });
}

module.exports = {
    removeDatesFromCreator: removeDatesFromCreator,
    addDatesToCreator: addDatesToCreator,
}