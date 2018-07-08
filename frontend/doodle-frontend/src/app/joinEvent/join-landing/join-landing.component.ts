import {Component, Inject, OnInit} from '@angular/core';
import {CreateService} from '../../services/create.service';
import {JoinService} from '../../services/join.service';

@Component({
  selector: 'app-join-landing',
  templateUrl: './join-landing.component.html',
  styleUrls: ['./join-landing.component.css']
})
export class JoinLandingComponent implements OnInit {

  joinService: JoinService;

  constructor(@Inject(JoinService) joinService: JoinService) {
    this.joinService = joinService;
  }


  ngOnInit() {
  }

  switchError() {
    this.joinService.wrongID = true;
  }
}
