import {Component, Inject, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {JoinService} from '../../services/join.service';
import {ViewService} from '../../services/view.service';

@Component({
  selector: 'app-view-summary',
  templateUrl: './view-summary.component.html',
  styleUrls: ['./view-summary.component.css']
})
export class ViewSummaryComponent implements OnInit {

  viewService: ViewService;
  callGetData = true;
  showEventDetails = false;
  constructor(@Inject(ViewService) viewService: ViewService, private route: ActivatedRoute) {
    console.log("CALL ViewSummaryComponent CONSRTUCTOR");
    this.viewService = viewService;
    this.route.params.subscribe(params => {
      console.log("READ PARAMS");
      this.viewService.UUID = params.id;
      if(this.callGetData){
        this.viewService.getData();
        this.callGetData = false;
      }

    });
  }

  ngOnInit() {
    console.log(this.viewService.serverData);
  }

}
