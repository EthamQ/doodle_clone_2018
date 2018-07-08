import {Component, Inject, OnInit} from '@angular/core';
import { EventService } from '../../services/event.service';
import { AdminService } from '../../services/admin.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-admin-view',
    templateUrl: 'admin-view.component.html'
})

export class AdminViewComponent implements OnInit {

  adminService: AdminService;

  constructor(@Inject(AdminService) adminService: AdminService,
              private eventService: EventService ) {
    this.adminService = adminService;
  }
    ngOnInit() {
     }

    adminIdSubmitted(adminId) {
        this.eventService.getEventByAdminId(adminId).subscribe(data => {
            console.log(data);
            let response = <any>data;
            if (response.success && response.data[0].adminAccess) {
                this.adminService.setEditActive(true);
                this.adminService.setAdminId(adminId);
                this.adminService.setEventData(response.data[0]);
                this.adminService.updatedValues.title = this.adminService.getEventData().title;
                this.adminService.updatedValues.description = this.adminService.getEventData().description;
                this.adminService.updatedValues.location = this.adminService.getEventData().location;
            }
            else {
                this.adminService.showError(true);
                console.log(this.adminService.wrongID);
                console.log('not a valid adminId -> error message' + this.adminService.getError());

            }
        });

    }
}
