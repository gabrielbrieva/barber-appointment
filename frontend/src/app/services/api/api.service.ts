import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
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

  constructor(private logger: NGXLogger, private http: HttpClient) { }

  getAppointments(): Observable<IAppointmentItem[]> {
    this.logger.info(`Getting all appointments done by some barber: ${env.apiEndpoint}/appointments`);

    return this.http.get<{ items: IAppointmentItem[] }>(`${env.apiEndpoint}/appointments`)
      .pipe(
        catchError(err => {
          this.logger.error(err);
          return [];
        }),
        map(r => {
          if (!r.items || r.items.length === 0) {
            this.logger.info('NO Appointments found');
            return [];
          }

          this.logger.info(`Appointments result: ${JSON.stringify(r.items)}`);

          return r.items;
        })
      );
  }

  getAppointmentsByUser(idToken: string): Promise<IAppointmentItem[]> {

    this.logger.info(`Getting all user appointments from ${env.apiEndpoint}/userappointments`);

    return this.http.get<{ items: IAppointmentItem[] }>(`${env.apiEndpoint}/userappointments`, {
      headers: {
        Authorization: `Bearer ${idToken}`
      }
    })
    .pipe(
      catchError(err => {
        this.logger.error(err);
        return [];
      }),
      map(r => {
        if (!r.items || r.items.length === 0) {
          this.logger.info('NO Appointments found');
          return [];
        }

        this.logger.info(`Appointments result: ${JSON.stringify(r.items)}`);

        return r.items;
      })
    )
    .toPromise();
  }

  async getUploadUrl(prefix: string, appointmentId: string, idToken: string): Promise<string> {

    this.logger.info(`Getting S3 signed URL to upload file...`);

    return this.http.get<{ uploadUrl: string }>(`${env.apiEndpoint}/appointments/${appointmentId}/attachment/${prefix}`, {
      headers: {
        Authorization: `Bearer ${idToken}`
      }
    })
    .pipe(
      catchError(err => {
        this.logger.error(err);
        return null as any;
      }),
      map(r => {
        const url: string = (r as { uploadUrl: string }).uploadUrl;
        this.logger.info(`Signed URL: ${url}`);
        return url;
      })
    )
    .toPromise();
  }

  async createAppointment(appointment: INewAppointmentReq, idToken: string): Promise<IAppointmentItem> {

    this.logger.info(`Creating Appointment: ${JSON.stringify(appointment)}`);

    const newItem = await this.http.post<IAppointmentItem>(`${env.apiEndpoint}/appointments`, appointment, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      }
    }).toPromise<IAppointmentItem>();

    this.logger.info(`Appointment created: ${JSON.stringify(newItem)}`);

    return newItem;
  }

  async updateAppointment(appointment: IUpdateAppointmentReq, idToken: string): Promise<IAppointmentItem> {

    this.logger.info(`Updating Appointment: ${JSON.stringify(appointment)}`);

    const updatedItem = await this.http.patch<IAppointmentItem>(`${env.apiEndpoint}/appointments/${appointment.appointmentId}`,
      appointment, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`
        }
      }).toPromise<IAppointmentItem>();

    this.logger.info(`Appointment updated: ${updatedItem}`);

    return updatedItem;
  }

  async updateReview(review: IUpdateReviewReq, appointmentId: string, idToken: string): Promise<IAppointmentItem> {

    this.logger.info(`Updating Appointment Review: ${JSON.stringify(review)}`);

    const updatedReview = await this.http.patch<IAppointmentItem>(`${env.apiEndpoint}/appointments/review/${appointmentId}`, review, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      }
    }).toPromise<IAppointmentItem>();

    this.logger.info(`Appointment review updated: ${updatedReview}`);

    return updatedReview;
  }

  async delete(appointmentId: string, idToken: string): Promise<any> {

    this.logger.info(`Deleting Appointment: ${JSON.stringify(appointmentId)}`);

    await this.http.delete(`${env.apiEndpoint}/appointments/${appointmentId}`, {
      headers: {
        Authorization: `Bearer ${idToken}`
      }
    }).toPromise();

    this.logger.info(`Appointment deleted`);
  }
}
