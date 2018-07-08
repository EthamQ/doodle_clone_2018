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
      description: 'my mom is not at home',
      creator: {
        name: 'thai',
      },
      date: [
        {
          date: 'Fri, Jul 6, 2018 12:00 AM',
          timeFrom: 1530828000,
          timeTo: 1530828000
        },
        {
          date: 'Thu, Jul 5, 2018 3:45 AM',
          timeFrom: 1530755100,
          timeTo: 1530820800
        }
      ]
    };

  dateInput = [
    {
      value: new Date("Thu Jul 19 2018 00:00:00 GMT+0200 (Mitteleuropäische Sommerzeit)"),
      expectedValueForDatabase: 1531951200,
    },
    {
      value: new Date("Wed Jul 25 2018 00:00:00 GMT+0200 (Mitteleuropäische Sommerzeit)"),
      expectedValueForDatabase: 1532469600,
    }

  ];
}




