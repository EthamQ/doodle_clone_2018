import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {LandingPageComponent} from './landing-page/landing-page.component';
import {JoinLandingComponent} from './joinEvent/join-landing/join-landing.component';
import {CreateLandingComponent} from './createEvent/create-landing/create-landing.component';
import {AdminLandingComponent} from './adminEvent/admin-landing/admin-landing.component';
import {ViewLandingComponent} from './viewEvent/view-landing/view-landing.component';
import {CreatePersonalComponent} from './createEvent/create-personal/create-personal.component';
import {CreateCalendarComponent} from './createEvent/create-calendar/create-calendar.component';
import {CreateSummaryComponent} from './createEvent/create-summary/create-summary.component';

const routes: Routes = [
  { path: '', component: LandingPageComponent},
  { path: 'join', component: JoinLandingComponent},
  { path: 'admin', component: AdminLandingComponent },
  { path: 'view', component: ViewLandingComponent },
  { path: 'create',
    component: CreateLandingComponent,
    children: [
      {path: 'details', component: CreatePersonalComponent},
      {path: 'calendar', component: CreateCalendarComponent},
      {path: 'summary', component: CreateSummaryComponent},
    ]},

];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
