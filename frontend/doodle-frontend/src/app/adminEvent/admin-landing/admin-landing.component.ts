import {Component, OnInit, EventEmitter, Output, Inject} from '@angular/core';
import { Router } from '@angular/router';
import {AdminViewStateTracker} from '../../services/stateTracker/admin-view-stateTracker';
import {CreateService} from '../../services/create.service';

@Component({
  selector: 'app-admin-landing',
  templateUrl: './admin-landing.component.html',
  styleUrls: ['./admin-landing.component.css']
})
export class AdminLandingComponent implements OnInit {

  @Output() adminIdSubmit = new EventEmitter();

  private adminId: string;
  stateTracker: AdminViewStateTracker;

  constructor(@Inject(AdminViewStateTracker) stateTrack: AdminViewStateTracker, private router: Router ) {
    this.stateTracker = stateTrack;
  }

  ngOnInit() {
  }

  navigeToAdminEdit() {
    this.adminIdSubmit.emit(this.adminId) ;

  }

  setAdminId(adminId) {
    this.adminId = adminId;
  }

}
