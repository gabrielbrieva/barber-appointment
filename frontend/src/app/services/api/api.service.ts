import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { INewAppointmentReq } from 'src/app/models/INewAppointmentReq';
import { IUpdateAppointmentReq } from 'src/app/models/IUpdateAppointmentReq';
import { IUpdateReviewReq } from 'src/app/models/IUpdateReviewReq';
import { environment as env } from 'src/environments/environment';
import { IAppointmentItem } from '../../models/IAppointmentItem';

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

  getAppointmentsByUser(idToken: string): Promise<IAppointmentItem[]> {
    return this.http.get<{ items: IAppointmentItem[] }>(`${env.apiEndpoint}/userappointments`, {
      headers: {
        Authorization: `Bearer ${idToken}`
      }
    })
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
    )
    .toPromise();
  }

  async getUploadUrl(prefix: string, appointmentId: string, idToken: string): Promise<string> {
    return this.http.get<{ uploadUrl: string }>(`${env.apiEndpoint}/appointments/${appointmentId}/attachment/${prefix}`, {
      headers: {
        Authorization: `Bearer ${idToken}`
      }
    })
    .pipe(
      catchError(err => null as any),
      map(r => (r as { uploadUrl: string }).uploadUrl )
    )
    .toPromise();
  }

  async createAppointment(appointment: INewAppointmentReq, idToken: string): Promise<IAppointmentItem> {
    return this.http.post<IAppointmentItem>(`${env.apiEndpoint}/appointments`, appointment, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      }
    }).toPromise<IAppointmentItem>();
  }

  async updateAppointment(appointment: IUpdateAppointmentReq, idToken: string): Promise<IAppointmentItem> {
    return this.http.patch<IAppointmentItem>(`${env.apiEndpoint}/appointments/${appointment.appointmentId}`, appointment, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      }
    }).toPromise<IAppointmentItem>();
  }

  async updateReview(review: IUpdateReviewReq, appointmentId: string, idToken: string): Promise<IAppointmentItem> {
    return this.http.patch<IAppointmentItem>(`${env.apiEndpoint}/appointments/review/${appointmentId}`, review, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      }
    }).toPromise<IAppointmentItem>();
  }

  delete(appointmentId: string, idToken: string): Promise<any> {
      return this.http.delete(`${env.apiEndpoint}/appointments/${appointmentId}`, {
        headers: {
          Authorization: `Bearer ${idToken}`
        }
      }).toPromise();
  }
}
