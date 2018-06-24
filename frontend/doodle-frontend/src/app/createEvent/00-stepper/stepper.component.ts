import {Component, Inject, OnInit} from '@angular/core';
import {CreateService} from "../../services/create.service";


@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.css'],
})
export class StepperComponent  implements  OnInit {
isLinear = false;
createService: CreateService;
  constructor(@Inject(CreateService) createService: CreateService){
    this.createService = createService;
  }

ngOnInit() {

  }
}
