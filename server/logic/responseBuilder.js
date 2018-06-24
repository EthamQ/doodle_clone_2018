module.exports = class Response{

    constructor() {
        this.response = {
            success: false,
            message: "no message specified",
            data: []
        }
        this.messages = {
            NEW_DOODLE_EVENT_SUCCESS: "New doodle Event successfully created",
            NEW_DOODLE_EVENT_FAILURE: "Something went wrong when inserting into the database",
            GET_DOODLE_EVENT_BY_UUID_SUCCESS: "Event with the UUID found",
            GET_DOODLE_EVENT_BY_CREATOR_UUID_SUCCESS: "Event with the UUID of the creator found",
            GET_DOODLE_EVENT_BY_UUID_FAILURE: "No event with the UUID was found",
            DATABASE_FAILURE: "Something went wrong when communicating with the database",
            ADD_PARTICIPANT_SUCCESS: "Participant was added to the event",
            REQUIRED_KEYS_MISSING_FAILURE: "Required values are missing",
            ADD_DATE_TO_PARTICIPANT_SUCCESS: "Date was added to the participant",
            ADD_DATE_TO_PARTICIPANT_FAILURE: "Date could not be added to the participant",
        }
    }

    getDateAddedToParticipantSuccessMsg(){
        return this.messages.ADD_DATE_TO_PARTICIPANT_SUCCESS;
    }
    getDateAddedToParticipantFailureMsg(){
        return this.message.ADD_DATE_TO_PARTICIPANT_FAILURE;
    }
    getModelIsInvalidFailureMsg(){
        return this.messages.REQUIRED_KEYS_MISSING_FAILURE;
    }
    getParticipantAddedSuccessMsg(){
        return this.messages.ADD_PARTICIPANT_SUCCESS;
    }
    getNewDoodleEventSuccessMsg(){
        return this.messages.NEW_DOODLE_EVENT_SUCCESS;
    }
    getDoodleEventByUUIDFailureMsg(){
        return this.messages.NEW_DOODLE_EVENT_FAILURE;
    }
    getDoodleEventByUUIDSuccessMsg(){
        return this.messages.GET_DOODLE_EVENT_BY_UUID_SUCCESS;
    }
    getDoodleEventByCreatorUUIDSuccessMsg(){
        return this.messages.GET_DOODLE_EVENT_BY_CREATOR_UUID_SUCCESS;
    }
    getNewDoodleEventFailureMsg(){
        return this.messages.NEW_DOODLE_EVENT_FAILURE;
    }
    getDatabaseFailureMsg(){
        return this.messages.DATABASE_FAILURE;
    }

    setSuccess(success){
        this.response.success = success;
    }

    setMessage(message){
        this.response.message = message;
    }

    addData(data){
        this.response.data.push(data);
    }

    getResponse(){
        return this.response;
    }
}