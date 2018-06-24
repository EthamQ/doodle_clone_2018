import {Component, Inject, OnChanges, OnInit} from '@angular/core';
import {CreateService} from "../../services/create.service";
import {DateService} from "../../services/date.service";

@Component({
  selector: 'app-personal-information',
  templateUrl: './personal-information.component.html',
  styleUrls: ['./personal-information.component.css']
})
export class PersonalInformationComponent implements OnInit, OnChanges {
  mail:string;
  createService: CreateService;
  constructor(@Inject(CreateService) createService: CreateService){
    this.createService = createService;
  }

  ngOnChanges(){
    console.log(this.createService.userInformation.name);
  }
  ngOnInit() {
  }

}
