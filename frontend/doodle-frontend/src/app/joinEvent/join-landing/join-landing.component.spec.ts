import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinLandingComponent } from './join-landing.component';
import { AppModule } from '../../app.module';
import { RouterModule } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';

describe('JoinLandingComponent', () => {
  let component: JoinLandingComponent;
  let fixture: ComponentFixture<JoinLandingComponent>;

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
    fixture = TestBed.createComponent(JoinLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
