import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalendarComponent }      from './createEvent/03-calendar/calendar.component';
import {FinishPageComponent} from './createEvent/05-finish-page/finish-page.component';
import {LandingPageComponent} from './createEvent/01-landing-page/landing-page.component';
import {JoinPageComponent} from './joinEvent/01-join-page/join-page.component';
import {PersonalInformationComponent} from './createEvent/02-personal-information/personal-information.component';
import {StepperComponent} from './createEvent/00-stepper/stepper.component';
import {ResultComponent} from './createEvent/04-result/result.component';

const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'stepper', component: StepperComponent },
  { path: 'joinpage', component: JoinPageComponent }

];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
