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
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
