import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinCalendarComponent } from './join-calendar.component';

describe('JoinCalendarComponent', () => {
  let component: JoinCalendarComponent;
  let fixture: ComponentFixture<JoinCalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JoinCalendarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
