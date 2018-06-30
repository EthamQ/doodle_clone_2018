import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinLandingComponent } from './join-landing.component';

describe('JoinLandingComponent', () => {
  let component: JoinLandingComponent;
  let fixture: ComponentFixture<JoinLandingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JoinLandingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
