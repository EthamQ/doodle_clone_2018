import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin.service';


@Component({
  selector: 'app-admin-options',
  templateUrl: './admin-options.component.html',
  styleUrls: ['./admin-options.component.css']
})
export class AdminOptionsComponent implements OnInit {

  modalOpen = false;
  
  constructor(private adminService: AdminService) { }

  ngOnInit() {
  }

}
