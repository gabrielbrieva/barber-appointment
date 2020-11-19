import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment as env } from 'src/environments/environment';
import { IAppointmentItem } from './models/IAppointmentItem';
import { INewAppointmentReq } from './models/INewAppointmentReq';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  getAppointments(): Observable<IAppointmentItem[]> {
    return this.http.get<{ items: IAppointmentItem[] }>(`${env.apiEndpoint}/appointments`)
      .pipe(
        catchError(err => {
          return [];
        }),
        map(r => {
          if (!r.items || r.items.length === 0) {
            return [];
          }

          return r.items;
        })
      );
  }

  async createAppointment(appointment: INewAppointmentReq, idToken: string): Promise<IAppointmentItem> {
    return this.http.post<IAppointmentItem>(`${env.apiEndpoint}/appointments`, appointment, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      }
    }).toPromise<IAppointmentItem>();
  }
}
