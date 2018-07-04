import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-admin-edit',
  templateUrl: './admin-edit.component.html',
  styleUrls: ['./admin-edit.component.css']
})
export class AdminEditComponent implements OnInit {

  public eventToEdit;
  @Input() adminID : string;

  constructor() { }

  ngOnInit() {
    console.log(this.adminID);
  }

}
