import {Component, Inject, OnInit} from '@angular/core';
import {JoinService} from '../../services/join.service';

@Component({
  selector: 'app-join-calendar',
  templateUrl: './join-calendar.component.html',
  styleUrls: ['./join-calendar.component.css']
})
export class JoinCalendarComponent implements OnInit {

  joinService: JoinService;
  constructor(@Inject(JoinService) joinService: JoinService) {
    this.joinService = joinService;
  }

  ngOnInit() {
  }

  changeVal(input) {
    console.log(input);
    input = !input;
  }
}
