import { HttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AuthService } from '@auth0/auth0-angular';
import { NGXLogger } from 'ngx-logger';
import { of } from 'rxjs';
import { IAppointmentItem } from 'src/app/models/IAppointmentItem';
import { ApiService } from 'src/app/services/api/api.service';

import { AppointmentItemComponent } from './appointment-item.component';

const AuthServiceMock = {
  isAuthenticated$: of<boolean>(true),
  user$: of<any>({ name: 'John Snow'}),
  idTokenClaims$: of({ name: 'John Snow', __raw: 'JWT_ID_TOKEN' })
};

const ApiServiceMock = {
  getAppointmentsByUser: async (idToken: string) => { return [{
    userId: '123',
    appointmentId: '321',
    barberId: 'Dummy Barber',
    serviceId: 'Full Shave',
    date: '2020-11-24',
    time: '13:00',
    done: false,
    userName: 'John Snow',
    afterImg: 'path/to/img',
    beforeImg: 'path/to/img',
    score: 5,
    comment: 'good job'
  }] as IAppointmentItem[]; },

  getUploadUrl: async (prefix: string, appointmentId: string, idToken: string) => 'SIGNED URL'
};

describe('AppointmentItemComponent', () => {
  let component: AppointmentItemComponent;
  let fixture: ComponentFixture<AppointmentItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ MatDialogModule ],
      providers: [
        { provide: NGXLogger, useValue: jasmine.createSpyObj('NGXLogger', [ 'debug', 'info', 'error' ]) },
        { provide: FormBuilder, useValue: jasmine.createSpyObj('FormBuilder', [ 'group' ]) },
        { provide: AuthService, useValue: AuthServiceMock },
        { provide: ApiService, useValue: ApiServiceMock },
        { provide: MatDialog },
        { provide: HttpClient }
      ],
      declarations: [ AppointmentItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointmentItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
