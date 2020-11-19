import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@auth0/auth0-angular';
import { map } from 'rxjs/operators';
import { Barbers } from 'src/app/data/Barbers';
import { ApiService } from 'src/app/services/api/api.service';
import { INewAppointmentReq } from 'src/app/services/api/models/INewAppointmentReq';
import { Services } from '../../data/Services';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-appointment-wizard',
  templateUrl: './appointment-wizard.component.html',
  styleUrls: ['./appointment-wizard.component.scss']
})
export class AppointmentWizardComponent implements OnInit {

  formGroups: FormGroup[];
  minDate: Date;
  selectedDate: Date;
  barberServices: string[] = Services;
  barbers: string[] = Barbers;

  @Input()
  formData: INewAppointmentReq;

  constructor(private formBuilder: FormBuilder, private auth: AuthService, private apiSrv: ApiService, private datePipe: DatePipe) {
    this.minDate = new Date();
    this.minDate.setHours(0, 0, 0);
  }

  ngOnInit(): void {
    if (!this.formData) {
      this.formData = {
        serviceId: '',
        barberId: '',
        date: undefined,
        time: ''
      };
    }

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

    this.formData.date = this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd');

    this.auth.idTokenClaims$.pipe(map(r => r.__raw)).subscribe(async idToken => {
      const result = await this.apiSrv.createAppointment(this.formData, idToken);
      console.log(JSON.stringify(result));
    });
  }

}
