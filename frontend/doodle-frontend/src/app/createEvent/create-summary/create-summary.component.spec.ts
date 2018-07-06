import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSummaryComponent } from './create-summary.component';
import { APP_BASE_HREF } from '@angular/common';
import { AppModule } from '../../app.module';
import { RouterModule } from '@angular/router';

describe('CreateSummaryComponent', () => {
  let component: CreateSummaryComponent;
  let fixture: ComponentFixture<CreateSummaryComponent>;

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
    fixture = TestBed.createComponent(CreateSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
