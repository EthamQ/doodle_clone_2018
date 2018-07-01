import {DatesModel} from './dates.model';
import {ParticipantModel} from './participant.model';
import {CreatorModel} from './creator.model';

export class EventModel {
  title: string;
  location: string;
  description: string;
  eventType: string;
  creator: CreatorModel;
  date: DatesModel [];
  participants: ParticipantModel[];
  constructor() {
    this.date = [];
    this.participants = [];
  }
}
