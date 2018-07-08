import {Component, Inject, OnInit} from '@angular/core';
import {JoinService} from '../services/join.service';
import {CreateService} from '../services/create.service';
import {AdminService} from '../services/admin.service';
import {EventService} from '../services/event.service';
import {ViewService} from '../services/view.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {

  joinService: JoinService;
  createService: CreateService;
  adminService: AdminService;
  viewService: ViewService;
  constructor(
    @Inject(JoinService) joinService: JoinService,
    @Inject(CreateService) createService: CreateService,
    @Inject(AdminService) adminService: AdminService,
    @Inject(ViewService) viewService: ViewService
  ) {
     this.joinService = joinService;
     this.adminService = adminService;
     this.createService = createService;
     this.viewService = viewService;
  }

  ngOnInit() {
    this.createService.reset();
    this.joinService.reset();
    this.viewService.reset();
    this.adminService.reset();
    console.log(this.joinService.serverData);
    console.log(this.createService.event);
    console.log(this.adminService.stateTracker);
  }

}
