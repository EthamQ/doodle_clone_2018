export class ParticipantModel{
  name: string;
  email: string;
  selection: boolean[];
  constructor(name:string, mail: string) {
    this.name = name;
    this.email = mail;
  }

  setDefaultSelection(numDates){
    let i = 0;
    while(i > numDates){
      this.selection.push(false);
      i = i+1;
    }
  }
}
