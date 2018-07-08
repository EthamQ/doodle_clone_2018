import {Component, OnInit, EventEmitter, Output, Inject} from '@angular/core';
import { Router } from '@angular/router';
import {CreateService} from '../../services/create.service';
import {AdminService} from '../../services/admin.service';

@Component({
  selector: 'app-admin-landing',
  templateUrl: './admin-landing.component.html',
  styleUrls: ['./admin-landing.component.css']
})
export class AdminLandingComponent implements OnInit {

  @Output() adminIdSubmit = new EventEmitter();

  private adminId: string;
  adminService: AdminService;

  constructor(@Inject(AdminService) adminService: AdminService, private router: Router ) {
    this.adminService = adminService;
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
