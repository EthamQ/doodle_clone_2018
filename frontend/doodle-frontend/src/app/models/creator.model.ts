export class CreatorModel {
  name: string;
  email: string;
  selection: boolean[];
  constructor(name: string, mail: string) {
    this.name = name;
    this.email = mail;
  }
}
