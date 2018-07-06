import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSummaryComponent } from './view-summary.component';
import { APP_BASE_HREF } from '@angular/common';
import { AppModule } from '../../app.module';
import { RouterModule } from '@angular/router';

describe('ViewSummaryComponent', () => {
  let component: ViewSummaryComponent;
  let fixture: ComponentFixture<ViewSummaryComponent>;

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
    fixture = TestBed.createComponent(ViewSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
