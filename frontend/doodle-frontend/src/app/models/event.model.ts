import {DatesModel} from './dates.model';
import {ParticipantModel} from './participant.model';

export class EventModel {
  title: string;
  creator: string;
  description: string;
  dates: DatesModel [];
  participants: ParticipantModel[];
}
