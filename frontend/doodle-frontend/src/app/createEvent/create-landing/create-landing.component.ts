import {Component, Inject, OnInit} from '@angular/core';
import {JoinService} from '../../services/join.service';
import {CreateService} from '../../services/create.service';

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

}
