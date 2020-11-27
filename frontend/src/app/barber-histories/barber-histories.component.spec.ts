import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NGXLogger } from 'ngx-logger';
import { Observable } from 'rxjs';
import { ApiService } from '../services/api/api.service';

import { BarberHistoriesComponent } from './barber-histories.component';

import { of } from 'rxjs';
import { AuthService } from '@auth0/auth0-angular';
import { IAppointmentItem } from '../models/IAppointmentItem';
import { IBarberHistory } from '../models/IBarberHistory';

const AuthServiceMock = {
  isAuthenticated$: of<boolean>(true),
  user$: of<any>({ name: 'John Snow'})
};

const ApiServiceMock = {
  getAppointments: (): Observable<IAppointmentItem[]> => {
    return of<IAppointmentItem[]>([
      {
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
      }
    ]);
  }
};

describe('BarberHistoriesComponent', () => {
  let component: BarberHistoriesComponent;
  let fixture: ComponentFixture<BarberHistoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: NGXLogger, useValue: jasmine.createSpyObj('NGXLogger', [ 'debug', 'info', 'error' ]) },
        { provide: ApiService, useValue: ApiServiceMock },
        { provide: AuthService, useValue: AuthServiceMock }
      ],
      declarations: [ BarberHistoriesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BarberHistoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('load appointment items', done => {
    component.histories$?.subscribe(items => {
      expect(items.length).toEqual(1);
      expect(items[0].barberName).toEqual('Dummy Barber');
      done();
    });
  });
});



