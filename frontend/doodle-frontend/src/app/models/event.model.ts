import {CreatorModel} from "./creator.model";
import {a} from "@angular/core/src/render3";
import {DatesModel} from "./dates.model";

export class EventModel{
  title: string;
  location: string;
  description: string;
  eventType: string;
  creator: CreatorModel;
  dates: DatesModel[];
  constructor() {
    this.date = []
  }

  setTitle(title: string){
    this.title = title;
  }
  setLocation(location: string){
    this.location = location;
  }
  setDescription(description: string){
    this.description = description;
  }

  setEventType(eventType: string){
    this.eventType = eventType;
  }
  setCreator(creator: CreatorModel){
    this.creator = creator;
  }
  addDate(date: DatesModel) {
    this.dates.push(date);
  }


}
