import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {LandingPageComponent} from './landing-page/landing-page.component';
import {JoinLandingComponent} from './joinEvent/join-landing/join-landing.component';
import {CreateLandingComponent} from './createEvent/create-landing/create-landing.component';
import {AdminLandingComponent} from './adminEvent/admin-landing/admin-landing.component';
import {ViewLandingComponent} from './viewEvent/view-landing/view-landing.component';

const routes: Routes = [
  { path: '', component: LandingPageComponent},
  { path: 'join', component: JoinLandingComponent},
  { path: 'create', component: CreateLandingComponent},
  { path: 'admin', component: AdminLandingComponent },
  { path: 'view', component: ViewLandingComponent }

];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
