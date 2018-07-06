import {Component, Inject, OnInit} from '@angular/core';
import {JoinService} from '../../services/join.service';
import {ActivatedRoute, Router} from '@angular/router';
import { AdminService } from '../../services/admin.service';
import {callbackify} from 'util';
@Component({
  selector: 'app-join-calendar',
  templateUrl: './join-calendar.component.html',
  styleUrls: ['./join-calendar.component.css']
})
export class JoinCalendarComponent implements OnInit {

  componentActive = true;
  joinService: JoinService;
  constructor(
    @Inject(JoinService) joinService: JoinService,
  private route: ActivatedRoute,
  private router: Router,
) {
    this.joinService = joinService;
    this.route.params.subscribe(params => {
      this.joinService.UUID = params.id;
      this.joinService.getData();
    });
  }

  ngOnInit() {

  }

  /**
   * waits until the participant is in the database
   * then it navigates to the view summary component
   */

  navigateToViewSummary() {
    this.componentActive = false;
    this.joinService.postDataAndWait(() => {
      this.router.navigate([this.joinService.viewNav]);
    });
  }
}
