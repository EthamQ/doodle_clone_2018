import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';

import { CreatePersonalComponent } from './create-personal.component';
import { AppModule } from '../../app.module';
import { APP_BASE_HREF } from '@angular/common';
import { RouterModule } from '@angular/router';
import { By } from '@angular/platform-browser';
import { CreateService } from '../../services/create.service';
import { DebugElement } from '@angular/core';
import { MockDataService } from '../../../test/mock-data.service';


describe('CreatePersonalComponent', () => {
  let component: CreatePersonalComponent;
  let fixture: ComponentFixture<CreatePersonalComponent>;
  let mockDataService: MockDataService;
  let titleInput: DebugElement;
  let locationInput: DebugElement;
  let adminNameInput: DebugElement;


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


  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePersonalComponent);
    mockDataService = new MockDataService();
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('user input title, location and admin name should be stored in the event object', fakeAsync(() => {
    tick();
    // title
    titleInput = fixture.debugElement.query(By.css('#title'));
    titleInput.nativeElement.value = mockDataService.createInput.title;
    titleInput.nativeElement.dispatchEvent(new Event('input'));
    expect(component.createService.event.title).toBe(mockDataService.createInput.title);

    // location
    locationInput = fixture.debugElement.query(By.css('#location'));
    locationInput.nativeElement.value = mockDataService.createInput.location;
    locationInput.nativeElement.dispatchEvent(new Event('input'));
    expect(component.createService.event.location).toBe(mockDataService.createInput.location);

    // admin name
    adminNameInput = fixture.debugElement.query(By.css('#name'));
    adminNameInput.nativeElement.value = mockDataService.createInput.creator.name;
    adminNameInput.nativeElement.dispatchEvent(new Event('input'));
    expect(component.createService.creator.name).toBe(mockDataService.createInput.creator.name);
  }));
});
