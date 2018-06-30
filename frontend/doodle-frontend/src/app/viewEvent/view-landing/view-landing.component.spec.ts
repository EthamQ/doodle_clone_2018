import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewLandingComponent } from './view-landing.component';

describe('ViewLandingComponent', () => {
  let component: ViewLandingComponent;
  let fixture: ComponentFixture<ViewLandingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewLandingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
