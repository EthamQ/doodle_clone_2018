import { Injectable } from '@angular/core';

@Injectable()
export class StepperService {

    public isCreate = true;
    constructor() { }

    setIsEdit(){
        this.isCreate = false;
    }

    setIsCreate(){
        this.isCreate = true;
    }
}