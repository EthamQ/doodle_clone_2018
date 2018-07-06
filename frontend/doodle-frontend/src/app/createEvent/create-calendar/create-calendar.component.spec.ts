import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCalendarComponent } from './create-calendar.component';
import { AppModule } from '../../app.module';
import { RouterModule } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';

describe('CreateCalendarComponent', () => {
  let component: CreateCalendarComponent;
  let fixture: ComponentFixture<CreateCalendarComponent>;

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
    fixture = TestBed.createComponent(CreateCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
