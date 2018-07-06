import {Component, Inject, OnInit} from '@angular/core';
import {JoinService} from '../../services/join.service';
import {CreateService} from '../../services/create.service';
import { isUndefined } from 'util';
import { StepperService } from '../../services/stepper-info.service';

@Component({
  selector: 'app-create-landing',
  templateUrl: './create-landing.component.html',
  styleUrls: ['./create-landing.component.css']
})
export class CreateLandingComponent implements OnInit {
  createService: CreateService;
  constructor(@Inject(CreateService) createservice: CreateService, private stepperService: StepperService) {
    this.createService = createservice;
  }

  ngOnInit() {
    this.stepperService.setIsCreate();
  }

  chooseDatesButtonIsDisabled(){
    return (isUndefined(this.createService.event.creator.name) && isUndefined(this.createService.event.description) && isUndefined(this.createService.event.title));
  }

  submitDates(){
    this.createService.isLoading = true;
    this.createService.setCalendar()
  }



}
