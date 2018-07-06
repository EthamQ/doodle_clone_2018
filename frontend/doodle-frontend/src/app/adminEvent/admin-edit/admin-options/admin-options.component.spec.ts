import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminOptionsComponent } from './admin-options.component';
import { RouterModule } from '@angular/router';
import { AppModule } from '../../../app.module';
import { APP_BASE_HREF } from '@angular/common';

describe('AdminOptionsComponent', () => {
  let component: AdminOptionsComponent;
  let fixture: ComponentFixture<AdminOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        // angular modules
        RouterModule.forRoot([]),

        // project modules
        AppModule,
    ],
      providers: [
        {
            provide: APP_BASE_HREF, useValue: '/'
        }
    ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
})
