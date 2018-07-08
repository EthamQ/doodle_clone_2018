import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {

  constructor() { }

  createInput =
    {
      title: 'thai\'s promi dinner',
      location: 'thai\'s living room',
      'description': 'my mom is not at home',
      creator: {
        name: 'thai',
      },
      'date': [
        {
          'date': 'Fri, Jul 6, 2018 12:00 AM',
          'timeFrom': 1530828000,
          'timeTo': 1530828000
        },
        {
          'date': 'Thu, Jul 5, 2018 3:45 AM',
          'timeFrom': 1530755100,
          'timeTo': 1530820800
        }
      ]
    };



}
