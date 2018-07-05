import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { MAT_CHECKBOX_CLICK_ACTION } from '@angular/material';

@Component({
  selector: 'app-date-selector',
  templateUrl: './date-selector.component.html',
  styleUrls: ['./date-selector.component.css']
})
export class DateSelectorComponent implements OnInit {

  @Input() dates: any[] = [];
  @Input() creator: any;
  @Input() participants: any[] = [];

  @Output() boxClick = new EventEmitter();
  constructor(private adminService: AdminService) { }

  ngOnInit() {
    console.log(this.participants);

  }

  handleBoxClick(participant, participantIndex, selectionIndex, newValue){
    this.participants[participantIndex].dates[selectionIndex] = newValue;
    this.boxClick.emit(this.participants[participantIndex]);
  }


}
