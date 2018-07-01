import {Component, Inject, OnInit} from '@angular/core';
import {CreateService} from '../../services/create.service';

@Component({
  selector: 'app-create-summary',
  templateUrl: './create-summary.component.html',
  styleUrls: ['./create-summary.component.css']
})
export class CreateSummaryComponent implements OnInit {

  createService: CreateService;
  constructor(@Inject(CreateService) createservice: CreateService) {
    this.createService = createservice;
  }

  ngOnInit() {}

  copyMessage(val: string) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }
}
