import {DatesModel} from './dates.model';
import {ParticipantModel} from './participant.model';
import {CreatorModel} from './creator.model';

export class ServerModel {
  uuid: string;
  url: string;
  timestamp: number;
  adminAccess: boolean;
  title: string;
  location: string;
  description: string;
  eventType: string;
  creator: CreatorModel;
  date: DatesModel [];
  participants: ParticipantModel[];
  constructor(data: any = {}) {
    this.uuid =  data.uuid;
    this.url = data.url;
    this.timestamp = data.number;
    this.adminAccess = data.adminAccess;
    this.title = data.title;
    this.location = data.location;
    this.description = data.description;
    this.eventType = data.eventType;
    this.creator = data.creator;
    this.date = data.date ;
    this.participants = data.participants;
  }
}
