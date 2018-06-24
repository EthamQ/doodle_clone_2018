import {Component, Inject, OnInit} from '@angular/core';
import {DateService} from "../services/date.service";
import {MAT_CHECKBOX_CLICK_ACTION} from "@angular/material";

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css'],
  providers: [
    {provide: MAT_CHECKBOX_CLICK_ACTION, useValue: 'check'}
  ]
})
export class ResultComponent implements OnInit {

  dateService: DateService;
  constructor(@Inject(DateService) dateService: DateService){
    this.dateService = dateService;
  }
  ngOnInit() {
    console.log(this.dateService.result);
    console.log(this.dateService.particpants);
    console.log(this.dateService.selectedDates);


  }
  checkValue(event: any){
    console.log(event);
  }
}



