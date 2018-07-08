import {Component, Inject, OnInit} from '@angular/core';
import { EventService } from '../../services/event.service';
import { AdminViewStateTracker } from '../../services/stateTracker/admin-view-stateTracker';
import { AdminService } from '../../services/admin.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-admin-view',
    templateUrl: 'admin-view.component.html'
})

export class AdminViewComponent implements OnInit {

  stateTracker: AdminViewStateTracker;

  constructor(@Inject(AdminViewStateTracker) stateTrack: AdminViewStateTracker,
              private eventService: EventService, private adminService: AdminService ) {
    this.stateTracker = stateTrack;
  }
    ngOnInit() {
        this.stateTracker.setEditActive(false);
     }

    adminIdSubmitted(adminId) {
        this.eventService.getEventByAdminId(adminId).subscribe(data => {
            console.log(data);
            let response = <any>data;
            if (response.success && response.data[0].adminAccess) {
                this.stateTracker.setEditActive(true)
                this.stateTracker.setAdminId(adminId);
                this.stateTracker.setEventData(response.data[0]);
                this.adminService.stateTracker = this.stateTracker;
                this.adminService.updatedValues.title = this.stateTracker.getEventData().title;
                this.adminService.updatedValues.description = this.stateTracker.getEventData().description;
                this.adminService.updatedValues.location = this.stateTracker.getEventData().location;
            }
            else {
                this.stateTracker.showError(true);
                console.log(this.stateTracker.wrongID);
                console.log("not a valid adminId -> error message" + this.stateTracker.getError());

            }
        });

    }
}
