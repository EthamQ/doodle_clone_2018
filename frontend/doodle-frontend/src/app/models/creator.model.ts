export class CreatorModel {
  name: string;
  email: string;
  selection: boolean[];
  constructor(mail: string) {
    this.email = mail;
    this.selection = [];
    this.name = "";
  }
}
