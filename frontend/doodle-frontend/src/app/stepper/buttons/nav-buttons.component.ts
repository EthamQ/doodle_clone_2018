import { Component, OnInit, Inject } from '@angular/core';
import { CreateService } from '../../services/create.service';
import { isUndefined } from 'util';
import { StepperService } from '../../services/stepper-info.service';

@Component({
    selector: 'app-stepper-nav-button',
    templateUrl: 'nav-button.html'
})

export class StepperNavButtonsComponent implements OnInit {
    createService: CreateService;
    constructor(@Inject(CreateService) createservice: CreateService, private stepperService: StepperService) {
      this.createService = createservice;
    }

    ngOnInit() {
        console.log("is create " + this.stepperService.isCreate);
     }

    chooseDatesButtonIsDisabled(){
        return (isUndefined(this.createService.event.creator.name) && isUndefined(this.createService.event.description) && isUndefined(this.createService.event.title));
      }
}