import {Component, Inject, OnInit} from '@angular/core';
import { AdminService } from '../../../services/admin.service';


@Component({
  selector: 'app-admin-options',
  templateUrl: './admin-options.component.html',
  styleUrls: ['./admin-options.component.css']
})
export class AdminOptionsComponent implements OnInit {

  modalOpen = false;
  updatedCreatorDates = [];
  adminService: AdminService;
  constructor(@Inject(AdminService) adminService: AdminService) {
    this.adminService = adminService;
  }

  ngOnInit() {
  }

  dateSelectionChanged(event) {
    this.updatedCreatorDates = event.dates;
    console.log(event);
  }

  updateCreatorDates() {
    this.adminService.isLoading = true;
    this.adminService.updateAdminDates(this.updatedCreatorDates, () => {
      this.adminService.isLoading = false;
    });
  }

}
