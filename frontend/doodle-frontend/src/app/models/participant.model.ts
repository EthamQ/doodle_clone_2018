export class ParticipantModel {
  name: string;
  selection: boolean[];
  constructor(name) {
    this.name = name;
    this.selection = [];
  }
}

