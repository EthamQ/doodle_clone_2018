import {Component, Inject} from '@angular/core';
import {NgbProgressbarConfig} from '@ng-bootstrap/ng-bootstrap';
import {DateService} from "./services/date.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [NgbProgressbarConfig] // add the NgbProgressbarConfig to the component providers

})
export class AppComponent {
  dateService: DateService;
  constructor(@Inject(DateService) dateService: DateService){
  this.dateService = dateService;
  }
}

function myFunction() {
  /* Get the text field */
  const copyText = document.getElementById("myInput");

  // Select the text field

  copyText.select();

  /* Copy the text inside the text field */
  document.execCommand("copy");

  /* Alert the copied text */
  alert("Copied the text: " + copyText.value);
}
