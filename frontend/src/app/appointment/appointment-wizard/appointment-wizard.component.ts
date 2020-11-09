import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface INewAppointment {
  jobTypeId: string;
  barberId: string;
  date: Date;
}

@Component({
  selector: 'app-appointment-wizard',
  templateUrl: './appointment-wizard.component.html',
  styleUrls: ['./appointment-wizard.component.scss']
})
export class AppointmentWizardComponent implements OnInit {

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;

  minDate: Date;

  formData: INewAppointment = {
    barberId: '',
    date: undefined,
    jobTypeId: ''
  };

  constructor(private formBuilder: FormBuilder) {
    this.minDate = new Date();
    this.minDate.setHours(0, 0, 0);
  }

  ngOnInit(): void {
    this.firstFormGroup = this.formBuilder.group({
      firstCtrl: ['', Validators.required]
    });

    this.secondFormGroup = this.formBuilder.group({
      secondCtrl: ['', Validators.required]
    });

    this.thirdFormGroup = this.formBuilder.group({
      thirdCtrl: ['', Validators.required]
    });
  }

  createAppointment(): void {
    console.log('create appointment based on "formData" variable');
  }

}
