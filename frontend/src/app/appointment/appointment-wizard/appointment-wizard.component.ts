import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@auth0/auth0-angular';
import { map } from 'rxjs/operators';
import { Barbers } from 'src/app/data/Barbers';
import { ApiService } from 'src/app/services/api/api.service';
import { Services } from '../../data/Services';
import { DatePipe } from '@angular/common';
import { MatStepper } from '@angular/material/stepper';
import { IUpdateAppointmentReq } from 'src/app/models/IUpdateAppointmentReq';
import { INewAppointmentReq } from 'src/app/models/INewAppointmentReq';

@Component({
  selector: 'app-appointment-wizard',
  templateUrl: './appointment-wizard.component.html',
  styleUrls: ['./appointment-wizard.component.scss']
})
export class AppointmentWizardComponent implements OnInit {

  States = {
    Ready: 0,
    IsLoading: 1,
    Created: 2
  };

  isUpdate = false;
  formGroups: FormGroup[];
  minDate: Date;
  selectedDate: Date;
  barberServices: string[] = Services;
  barbers: string[] = Barbers;
  state: number = this.States.Ready;

  @ViewChild('stepper')
  stepper: MatStepper;

  @Input()
  formData: INewAppointmentReq | IUpdateAppointmentReq;
  data: INewAppointmentReq | IUpdateAppointmentReq;

  @Output()
  done: EventEmitter<void> = new EventEmitter<void>();

  constructor(private formBuilder: FormBuilder, private auth: AuthService, private apiSrv: ApiService, private datePipe: DatePipe) {
    this.minDate = new Date();
    this.minDate.setHours(0, 0, 0);
  }

  ngOnInit(): void {

    if (this.formData) {
      this.isUpdate = true;
      this.selectedDate = new Date(`${this.formData.date} ${this.formData.time}`);
    } else {
      this.formData = {
        userName: '',
        serviceId: '',
        barberId: '',
        date: '',
        time: ''
      };
    }

    this.data = JSON.parse(JSON.stringify(this.formData));

    this.formGroups = [
      this.formBuilder.group({
        serviceCtrl: ['', Validators.required]
      }),
      this.formBuilder.group({
        barberCtrl: ['', Validators.required]
      }),
      this.formBuilder.group({
        dateCtrl: ['', Validators.required]
      }),
      this.formBuilder.group({
        timeCtrl: ['', Validators.required]
      })
    ];
  }

  async createAppointment(): Promise<void> {

    this.state = this.States.IsLoading;

    this.data.date = this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd');

    this.auth.idTokenClaims$.pipe(map(r => {
      if (r.name) {
        this.data.userName = r.name;
      }

      return r.__raw;
    })).subscribe(async idToken => {
      let result;

      if (this.isUpdate) {
        result = await this.apiSrv.updateAppointment(this.data as IUpdateAppointmentReq, idToken);
      } else {
        result = await this.apiSrv.createAppointment(this.data, idToken);
      }

      this.formData.serviceId = result.serviceId;
      this.formData.barberId = result.barberId;
      this.formData.date = result.date;
      this.formData.time = result.time;

      console.log(JSON.stringify(result));

      if (this.isUpdate) {
        this.afterCreated();
      } else {
        this.state = this.States.Created;
      }
    });
  }

  cancel(): void {
    if (!this.isUpdate) {
      this.stepper.reset();
    }

    this.resetFormData();
    this.done.emit();
  }

  afterCreated(): void {

    this.resetFormData();
    this.state = this.States.Ready;

    if (!this.isUpdate) {
      setTimeout(() => {
        this.stepper.reset();
        this.done.emit();
      });
    } else {
      this.done.emit();
    }
  }

  private resetFormData(): void {

    if (this.isUpdate) {
      this.selectedDate = new Date(`${this.formData.date} ${this.formData.time}`);
    } else {
      this.selectedDate = undefined;
    }

    this.data.userName = this.formData?.userName;
    this.data.serviceId = this.formData?.serviceId;
    this.data.barberId = this.formData?.barberId;
    this.data.date = this.formData?.date;
    this.data.time = this.formData?.time;
  }

}
