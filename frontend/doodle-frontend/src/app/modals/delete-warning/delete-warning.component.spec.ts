import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteWarningComponent } from './delete-warning.component';
import { RouterModule } from '@angular/router';
import { AppModule } from '../../app.module';
import { APP_BASE_HREF } from '@angular/common';

describe('DeleteWarningComponent', () => {
  let component: DeleteWarningComponent;
  let fixture: ComponentFixture<DeleteWarningComponent>;

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
    fixture = TestBed.createComponent(DeleteWarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
