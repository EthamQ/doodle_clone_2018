export class ParticipantModel {
  name: string;
  email: string;
  dates: boolean[];
  constructor(name) {
    this.name = name;
    this.dates = [];
    this.email = 'undefined@gmail.com';
  }
}

