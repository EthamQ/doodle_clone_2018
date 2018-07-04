import { Component, OnInit, Input } from '@angular/core';
import { CreateService } from '../../services/create.service';
import { StepperService } from '../../services/stepper-info.service';
import { Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';


@Component({
  selector: 'app-admin-edit',
  templateUrl: './admin-edit.component.html',
  styleUrls: ['./admin-edit.component.css']
})
export class AdminEditComponent implements OnInit {

  public eventToEdit;
  @Input() stateTracker : any;

  constructor(
    public createService: CreateService, 
    private stepperService: StepperService, 
    private router: Router,
    public adminService: AdminService
  ) { }

  ngOnInit() {
    this.stepperService.setIsEdit();
    this.router.navigate(['admin/details']);
    // console.log(this.stateTracker.getEventData());
  }

  chooseDatesButtonIsDisabled(){
    return false;
  }

}
