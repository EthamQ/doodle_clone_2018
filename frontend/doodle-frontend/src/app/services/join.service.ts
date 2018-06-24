import { Injectable } from '@angular/core';
import {DatesModel} from "../models/dates.model";



@Injectable()

export class JoinService {
  informationBool = false;
  constructor() {


  }
  informationEnter(){
    this.informationBool = true;

  }

}
