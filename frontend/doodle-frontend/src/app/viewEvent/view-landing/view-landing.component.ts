import {Component, Inject, OnInit} from '@angular/core';
import {ViewService} from '../../services/view.service';

@Component({
  selector: 'app-view-landing',
  templateUrl: './view-landing.component.html',
  styleUrls: ['./view-landing.component.css']
})
export class ViewLandingComponent implements OnInit {


  viewService: ViewService;
  constructor(@Inject(ViewService) viewService: ViewService) {
    this.viewService = viewService;
  }
  ngOnInit() {
  }

}
