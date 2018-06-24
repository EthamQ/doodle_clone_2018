import {Component, Inject, OnInit} from '@angular/core';
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


  ngOnInit() {



  }

}



