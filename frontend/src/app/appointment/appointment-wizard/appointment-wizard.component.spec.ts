import { DatePipe } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { AuthService } from '@auth0/auth0-angular';
import { NGXLogger } from 'ngx-logger';
import { of } from 'rxjs';
import { IAppointmentItem } from 'src/app/models/IAppointmentItem';
import { INewAppointmentReq } from 'src/app/models/INewAppointmentReq';
import { IUpdateAppointmentReq } from 'src/app/models/IUpdateAppointmentReq';
import { ApiService } from 'src/app/services/api/api.service';

import { AppointmentWizardComponent } from './appointment-wizard.component';

const AuthServiceMock = {
  isAuthenticated$: of<boolean>(true),
  user$: of<any>({ name: 'John Snow'}),
  idTokenClaims$: () => of({ name: 'John Snow', __raw: 'JWT_ID_TOKEN' })
};

const ApiServiceMock = {
  updateAppointment: async (req: IUpdateAppointmentReq, idToken: string) => { return {
    userId: '123',
    userName: 'John Snow',
    appointmentId: '321',
    barberId: req.barberId,
    serviceId: req.serviceId,
    date: req.date,
    time: req.time,
    done: false
  } as IAppointmentItem; },

  createAppointment: async (req: INewAppointmentReq, idToken: string) => { return {
    userId: '123',
    userName: 'John Snow',
    appointmentId: '321',
    barberId: req.barberId,
    serviceId: req.serviceId,
    date: req.date,
    time: req.time,
    done: false
  } as IAppointmentItem; }
};

describe('AppointmentWizardComponent', () => {
  let component: AppointmentWizardComponent;
  let fixture: ComponentFixture<AppointmentWizardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: NGXLogger, useValue: jasmine.createSpyObj('NGXLogger', [ 'debug', 'info', 'error' ]) },
        { provide: FormBuilder, useValue: jasmine.createSpyObj('FormBuilder', [ 'group' ]) },
        { provide: AuthService, useValue: AuthServiceMock },
        { provide: ApiService, useValue: ApiServiceMock },
        { provide: DatePipe, useValue: { transform: () => 'formated result' } },
      ],
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
