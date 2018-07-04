import {Component, Inject, OnInit} from '@angular/core';
import {JoinService} from '../../services/join.service';
import {CreateService} from '../../services/create.service';
import { isUndefined } from 'util';

@Component({
  selector: 'app-create-landing',
  templateUrl: './create-landing.component.html',
  styleUrls: ['./create-landing.component.css']
})
export class CreateLandingComponent implements OnInit {
  createService: CreateService;
  constructor(@Inject(CreateService) createservice: CreateService) {
    this.createService = createservice;
  }

  ngOnInit() {
  }

  chooseDatesButtonIsDisabled(){
    return (isUndefined(this.createService.event.creator.name) && isUndefined(this.createService.event.description) && isUndefined(this.createService.event.title));
  }



}
