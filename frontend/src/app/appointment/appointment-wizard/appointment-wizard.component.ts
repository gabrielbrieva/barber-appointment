import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface INewAppointment {
  jobTypeId: string;
  barberId: string;
  date: Date;
  time: string;
}

@Component({
  selector: 'app-appointment-wizard',
  templateUrl: './appointment-wizard.component.html',
  styleUrls: ['./appointment-wizard.component.scss']
})
export class AppointmentWizardComponent implements OnInit {

  formGroups: FormGroup[];

  minDate: Date;

  @Input()
  formData: INewAppointment;

  constructor(private formBuilder: FormBuilder) {
    this.minDate = new Date();
    this.minDate.setHours(0, 0, 0);
  }

  ngOnInit(): void {
    if (!this.formData) {
      this.formData = {
        jobTypeId: '',
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

  createAppointment(): void {
    console.log('create appointment based on "formData" variable');
  }

}
