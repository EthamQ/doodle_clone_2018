import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CalendarModule } from 'angular-calendar';
import {ScrollDispatchModule} from '@angular/cdk/scrolling';
import { MomentModule } from 'angular2-moment';
import {
  MatFormFieldModule,
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatStepperModule,
} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { StepperComponent } from './createEvent/00-stepper/stepper.component';
import { CalendarComponent } from './createEvent/03-calendar/calendar.component';
import {CommonModule} from "@angular/common";
import { ResultComponent } from './createEvent/04-result/result.component';
import {DateService} from "./services/date.service";
import { PersonalInformationComponent } from './createEvent/02-personal-information/personal-information.component';
import { LandingPageComponent } from './createEvent/01-landing-page/landing-page.component';
import { JoinPageComponent } from './joinEvent/01-join-page/join-page.component';
import { FinishPageComponent } from './createEvent/05-finish-page/finish-page.component';
import { AppRoutingModule } from './/app-routing.module';
import {RouterModule} from "@angular/router";
import {CreateService} from "./services/create.service";
import {JoinService} from "./services/join.service";

@NgModule({
  exports: [
    MatFormFieldModule,
    ScrollDispatchModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
  ],
  declarations: [],
  imports: []
})
export class MaterialModule {}

@NgModule({
  declarations: [
    StepperComponent,
    ResultComponent,
    CalendarComponent,
    PersonalInformationComponent,
    LandingPageComponent,
    JoinPageComponent,
    FinishPageComponent,
    AppComponent
  ],
  imports: [
    AppRoutingModule,
    MomentModule,
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    CalendarModule.forRoot(),
    FormsModule,
    HttpClientModule,
    MaterialModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    NgbModule.forRoot()
  ],
  providers: [DateService, CreateService, JoinService],
  bootstrap: [AppComponent]
})
export class AppModule { }
