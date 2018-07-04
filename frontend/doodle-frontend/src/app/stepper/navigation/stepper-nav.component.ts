import { Component, OnInit, Inject } from '@angular/core';
import { CreateService } from '../../services/create.service';


@Component({
    selector: 'app-stepper-nav',
    templateUrl: 'stepper-nav.component.html',
    styleUrls: ['./stepper-nav.component.css']
})

export class StepperNavigationComponent implements OnInit {

  readonly NAV_DETAIL = 0;
    createService: CreateService;

  constructor(@Inject(CreateService) createservice: CreateService) {
    this.createService = createservice;
  }

    ngOnInit() {

     }

     getNavItemClass(){
      return this.createService.detailsBool? 'navigation-item-disabled' : 'navigation-item';
     }
}