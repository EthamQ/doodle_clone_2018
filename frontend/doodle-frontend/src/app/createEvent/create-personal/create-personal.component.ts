import {Component, Inject, OnInit} from '@angular/core';
import {CreateService} from '../../services/create.service';

@Component({
  selector: 'app-create-personal',
  templateUrl: './create-personal.component.html',
  styleUrls: ['./create-personal.component.css']
})
export class CreatePersonalComponent implements OnInit {

  createService: CreateService;
  constructor(@Inject(CreateService) createservice: CreateService) {
    this.createService = createservice;
  }

  ngOnInit() {
  }
  setDetails() {
    this.createService.setDetails();
  }

}
