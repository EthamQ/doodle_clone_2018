import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewLandingComponent } from './view-landing.component';
import { APP_BASE_HREF } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppModule } from '../../app.module';

describe('ViewLandingComponent', () => {
  let component: ViewLandingComponent;
  let fixture: ComponentFixture<ViewLandingComponent>;

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
    fixture = TestBed.createComponent(ViewLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
