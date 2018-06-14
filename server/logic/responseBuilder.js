module.exports = class Response{

    constructor() {
        this.response = {
            success: false,
            message: "no message specified",
            data: null
        }
        this.messages = {
            NEW_DOODLE_EVENT_SUCCESS: "New doodle Event successfully created",
            NEW_DOODLE_EVENT_FAILURE: "Something went wrong when inserting into the database",
        }
    }

    getNewDoodleEventSuccessMsg(){
        return this.messages.NEW_DOODLE_EVENT_SUCCESS;
    }
    getNewDoodleEventFailureMsg(){
        return this.messages.NEW_DOODLE_EVENT_FAILURE;
    }

    setSuccess(success){
        this.response.success = success;
    }

    setMessage(message){
        this.response.message = message;
    }

    setData(data){
        this.data = data;
    }

    getResponse(){
        return this.response;
    }
}