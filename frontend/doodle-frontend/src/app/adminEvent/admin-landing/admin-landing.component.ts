import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-landing',
  templateUrl: './admin-landing.component.html',
  styleUrls: ['./admin-landing.component.css']
})
export class AdminLandingComponent implements OnInit {

  @Output() adminIdSubmit = new EventEmitter();

  private adminId: string;
  private wrongID: boolean;

  constructor(private router: Router) { }

  ngOnInit() {
    this.wrongID = false;
  }

  navigeToAdminEdit(){
    this.adminIdSubmit.emit(this.adminId);
    this.wrongID = true;
  }

  setAdminId(adminId){
    this.adminId = adminId;
  }

}
