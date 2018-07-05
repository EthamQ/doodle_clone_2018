import { Component, OnInit, Input } from '@angular/core';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-date-selector',
  templateUrl: './date-selector.component.html',
  styleUrls: ['./date-selector.component.css']
})
export class DateSelectorComponent implements OnInit {

  votes = [true, false];
  @Input() dates: any[] = [];
  @Input() creator: any;
  @Input() participants: any[] = [];
  constructor(private adminService: AdminService) { }

  ngOnInit() {
    this.participants.push(this.adminService.stateTracker.getEventData().creator);
    console.log(this.adminService.stateTracker.getEventData().creator);
  }


}
