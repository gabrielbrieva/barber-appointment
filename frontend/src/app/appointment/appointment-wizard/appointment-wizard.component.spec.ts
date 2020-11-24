import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentWizardComponent } from './appointment-wizard.component';

describe('AppointmentWizardComponent', () => {
  let component: AppointmentWizardComponent;
  let fixture: ComponentFixture<AppointmentWizardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppointmentWizardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointmentWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
