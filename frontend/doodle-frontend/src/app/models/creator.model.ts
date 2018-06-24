export class ParticipantModel{
  name: string;
  selection: boolean[];
  constructor(data: any = {}) {
    this.name = data.name;
    this.selection = [true, false, true, false, true, false, true];
  }
}
