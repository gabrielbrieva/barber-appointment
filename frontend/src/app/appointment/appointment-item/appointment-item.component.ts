import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface IAppointmentData {
  service: string;
  barber: string;
  date: Date;
  time: string;
  isDone: boolean;
  comment: string;
  score: number;
  beforeImg: string;
  afterImg: string;
}

@Component({
  selector: 'app-appointment-item',
  templateUrl: './appointment-item.component.html',
  styleUrls: ['./appointment-item.component.scss']
})
export class AppointmentItemComponent implements OnInit {

  @Input()
  formData;

  formGroup: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      commentCtrl: ['', Validators.required]
    });
  }

}
