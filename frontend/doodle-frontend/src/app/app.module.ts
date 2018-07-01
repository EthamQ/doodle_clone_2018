import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CalendarModule } from 'angular-calendar';
import {ScrollDispatchModule} from '@angular/cdk/scrolling';
import { MomentModule } from 'angular2-moment';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { DlDateTimePickerDateModule } from 'angular-bootstrap-datetimepicker';
import { NgDatepickerModule } from 'ng2-datepicker';

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
import {CommonModule} from '@angular/common';
import {DateService} from './services/date.service';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { AppRoutingModule } from './app-routing.module';
import {RouterModule} from '@angular/router';
import {CreateService} from './services/create.service';
import {JoinService} from './services/join.service';
import { AdminLandingComponent } from './adminEvent/admin-landing/admin-landing.component';
import { AdminEditComponent } from './adminEvent/admin-edit/admin-edit.component';
import { CreatePersonalComponent } from './createEvent/create-personal/create-personal.component';
import { CreateCalendarComponent } from './createEvent/create-calendar/create-calendar.component';
import { CreateSummaryComponent } from './createEvent/create-summary/create-summary.component';
import { JoinLandingComponent } from './joinEvent/join-landing/join-landing.component';
import { JoinCalendarComponent } from './joinEvent/join-calendar/join-calendar.component';
import { CreateLandingComponent } from './createEvent/create-landing/create-landing.component';
import { ViewLandingComponent } from './viewEvent/view-landing/view-landing.component';
import { ViewSummaryComponent } from './viewEvent/view-summary/view-summary.component';
import { YearPipe } from './pipes/year.pipe';
import { WeekdayPipe } from './pipes/weekday.pipe';
import { DayPipe } from './pipes/day.pipe';
import {MonthPipe} from './pipes/month.pipe';
import { TimeHourPipe } from './pipes/time-hour.pipe';

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

  imports: [],

  declarations: []
})
export class MaterialModule {}

@NgModule({
  declarations: [
    LandingPageComponent,
    CreateSummaryComponent,
    JoinLandingComponent,
    JoinCalendarComponent,
    AdminLandingComponent,
    AdminEditComponent,
    CreateLandingComponent,
    ViewLandingComponent,
    ViewSummaryComponent,
    CreatePersonalComponent,
    CreateCalendarComponent,
    AppComponent,
    YearPipe, WeekdayPipe, DayPipe, MonthPipe,TimeHourPipe
  ],
  imports: [
    AppRoutingModule,
    MomentModule,
    CommonModule,
    BrowserModule,
    DlDateTimePickerDateModule,
    BrowserAnimationsModule,
    CalendarModule.forRoot(),
    FormsModule,
    HttpClientModule,
    MaterialModule,
    MatNativeDateModule,
    NgDatepickerModule,
    ReactiveFormsModule,
    AngularFontAwesomeModule,
    NgbModule.forRoot()
  ],
  providers: [DateService, CreateService, JoinService],
  bootstrap: [AppComponent]
})
export class AppModule { }
