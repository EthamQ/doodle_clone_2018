import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { CreateLandingComponent } from './create-landing.component';
import { RouterModule } from '@angular/router';
import { AppModule } from '../../app.module';
import { APP_BASE_HREF } from '@angular/common';
import { CreatePersonalComponent } from '../create-personal/create-personal.component';
import { MockDataService } from '../../../test/mock-data.service';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { CreateCalendarComponent } from '../create-calendar/create-calendar.component';
import * as moment from 'moment';
import { CreateService } from '../../services/create.service';


describe('CreateLandingComponent', () => {
  // this component
  let component: CreateLandingComponent;
  let fixture: ComponentFixture<CreateLandingComponent>;
  let submitButton: DebugElement;

  // personal data
  let createPersonalComponent: CreatePersonalComponent;
  let fixturePersonal: ComponentFixture<CreatePersonalComponent>;
  let titleInput: DebugElement;
  let locationInput: DebugElement;
  let adminNameInput: DebugElement;
  let descriptionInput: DebugElement;

  // calendar
  let createCalendarComponent: CreateCalendarComponent;
  let fixtureCalendar: ComponentFixture<CreateCalendarComponent>;
  let datepicker: DebugElement;

  // services
  let mockDataService: MockDataService;

  let serviceInstance: CreateService;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        // angular modules
        RouterModule.forRoot([]),

        // project modules
        AppModule,
    ],
      declarations: [ ],
      providers: [
        {
            provide: APP_BASE_HREF, useValue: '/'
        }
    ]
    })
    .compileComponents();
  }));

  beforeAll(()=>{
    mockDataService = new MockDataService();
  });

  beforeEach(() => {
    // this component
    fixture = TestBed.createComponent(CreateLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    
    // CreatePersonalComponent
    fixturePersonal = TestBed.createComponent(CreatePersonalComponent);
    createPersonalComponent = fixturePersonal.componentInstance;
    fixturePersonal.detectChanges();

    // CreatePersonalComponent
    fixtureCalendar = TestBed.createComponent(CreateCalendarComponent);
    createCalendarComponent = fixtureCalendar.componentInstance;
    fixtureCalendar.detectChanges();

   
    
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  
  describe('CreatePersonalComponent', () => {
    it('should create CreatePersonalComponent', () => {
      expect(createPersonalComponent).toBeTruthy();
    });
    it('user input should be correctly stored in the event object', fakeAsync(() => {
      tick();
      // title
      titleInput = fixturePersonal.debugElement.query(By.css('#title'));
      titleInput.nativeElement.value = mockDataService.createInput.title;
      titleInput.nativeElement.dispatchEvent(new Event('input'));
      expect(component.createService.event.title).toBe(mockDataService.createInput.title);
  
      // location
      locationInput = fixturePersonal.debugElement.query(By.css('#location'));
      locationInput.nativeElement.value = mockDataService.createInput.location;
      locationInput.nativeElement.dispatchEvent(new Event('input'));
      expect(component.createService.event.location).toBe(mockDataService.createInput.location);
  
      // description
      descriptionInput = fixturePersonal.debugElement.query(By.css('#description'));
      descriptionInput.nativeElement.value = mockDataService.createInput.description;
      descriptionInput.nativeElement.dispatchEvent(new Event('input'));
      expect(component.createService.event.description).toBe(mockDataService.createInput.description);
  
      // admin name
      adminNameInput = fixturePersonal.debugElement.query(By.css('#name'));
      adminNameInput.nativeElement.value = mockDataService.createInput.creator.name;
      adminNameInput.nativeElement.dispatchEvent(new Event('input'));
      expect(component.createService.creator.name).toBe(mockDataService.createInput.creator.name);

      serviceInstance = component.createService;
    }));
  });

  describe('CreateCalendarComponent', () => {
    it('should create CreateCalendarComponent', () => {
      expect(CreateCalendarComponent).toBeTruthy();
    });
    it('user input in CreateCalendarComponent should be correctly stored in timeSelection', fakeAsync(() => {
      tick();
      datepicker = fixtureCalendar.debugElement.query(By.css('dl-date-time-picker'));
      for(let i = 0; i<mockDataService.dateInput.length; i++){
        let date = mockDataService.dateInput[i].value;
        let dateForChangeEvent = {value: {value: date}};
        datepicker.triggerEventHandler('change', dateForChangeEvent);
        let expectedValue = mockDataService.dateInput[i].expectedValueForDatabase;
        expect(component.createService.timeSelection[i].timeTo).toBe(expectedValue);
        serviceInstance.timeSelection = component.createService.timeSelection;
      }
    }));

  });

  
  describe('CreateLandingComponent', () => {
    it('click on submit button should generate the correct request data', () => {

      component.createService.event = serviceInstance.event;
      component.createService.creator = serviceInstance.creator;
      component.createService.timeSelection = serviceInstance.timeSelection;
      expect(component.createService.timeSelection.length).toBeGreaterThan(0);
      expect(component.createService.creator.name).toBe(mockDataService.createInput.creator.name);
      // component.createService.detailsBool = true;
      // submitButton = fixture.debugElement.query(By.css('#submit'));
      // submitButton.nativeElement.dispatchEvent(new Event('click'));
      // console.log("Event title: " + component.createService.event.title);
    });
  });
  
 
});
