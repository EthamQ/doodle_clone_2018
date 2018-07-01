import {Component, Inject, OnInit} from '@angular/core';
import {JoinService} from '../../services/join.service';
import {ActivatedRoute} from '@angular/router';
@Component({
  selector: 'app-join-calendar',
  templateUrl: './join-calendar.component.html',
  styleUrls: ['./join-calendar.component.css']
})
export class JoinCalendarComponent implements OnInit {

  joinService: JoinService;
  constructor(@Inject(JoinService) joinService: JoinService, private route: ActivatedRoute) {
    this.joinService = joinService;
    this.route.params.subscribe(params => {
      console.log(params);
      this.joinService.UUID = params.id;
      this.joinService.getData();
    });
  }

  ngOnInit() {
  }

  changeVal(input) {
    console.log(input);
    input = !input;
  }
}
