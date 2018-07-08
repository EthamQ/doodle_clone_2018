import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {

  constructor() { }

  createInput =
    {
      title: 'Example title',
      location: 'Example location',
      description: 'Example description',
      creator: {
        name: 'Thai',
      }
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




