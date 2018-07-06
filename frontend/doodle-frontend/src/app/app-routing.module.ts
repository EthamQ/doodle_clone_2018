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
import {JoinCalendarComponent} from './joinEvent/join-calendar/join-calendar.component';
import {ViewSummaryComponent} from './viewEvent/view-summary/view-summary.component';
import {AdminEditComponent} from './adminEvent/admin-edit/admin-edit.component';
import { AdminViewComponent } from './adminEvent/adminView/admin-view.component';
import {CreateGuardService} from './guards/create-guard.service';
import {JoinGuardService} from './guards/join-guard.service';

const routes: Routes = [
  { path: '', component: LandingPageComponent},
  { path: 'join',
    component: JoinLandingComponent,
    children: [
      {path: ':id', component: JoinCalendarComponent },
      {path: 'finish', component: LandingPageComponent}
    ]},
  { path: 'admin',
    component: AdminViewComponent,
    children: [
      {path: 'details', component: CreatePersonalComponent},
      {path: 'calendar', component: CreateCalendarComponent},
      {path: 'summary', component: CreateSummaryComponent},
      {path: ':id', component: AdminEditComponent}
    ]
  },
  { path: 'view',
    component: ViewLandingComponent,
    children: [
      {path: ':id', component: ViewSummaryComponent}
  ]},
  { path: 'create',
    component: CreateLandingComponent,
    children: [
      { path: '',   redirectTo: 'details', pathMatch: 'full' },
      {path: 'details', component: CreatePersonalComponent},
      {path: 'calendar', component: CreateCalendarComponent,     canActivate: [CreateGuardService]},
      {path: 'summary', component: CreateSummaryComponent,     canActivate: [CreateGuardService]}
    ]},

];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
