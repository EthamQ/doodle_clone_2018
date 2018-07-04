import { Component, OnInit } from '@angular/core';
import { EventService } from '../../services/event.service';
import { AdminViewStateTracker } from '../../services/stateTracker/admin-view-stateTracker';
import { AdminService } from '../../services/admin.service';

@Component({
    selector: 'app-admin-view',
    templateUrl: 'admin-view.component.html'
})

export class AdminViewComponent implements OnInit {

    public stateTracker = new AdminViewStateTracker();

    constructor(private eventService: EventService, private adminService: AdminService) { }

    ngOnInit() {
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
                console.log("not a valid adminId -> error message");
            }
        });

    }
}