import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePersonalComponent } from './create-personal.component';
import { AppModule } from '../../app.module';
import { APP_BASE_HREF } from '@angular/common';
import { RouterModule } from '@angular/router';
import { By } from '@angular/platform-browser';
import { CreateService } from '../../services/create.service';


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

  it('should access the title', () => {
    var actual = component.LOCATION;
    let a  = component
    let field: HTMLInputElement = fixture.debugElement.query(By.css('#title')).nativeElement;
    field.value = 'A';
     expect(component.createService.event.title).toBe('A');
    
  });
});
