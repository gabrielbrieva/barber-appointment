import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-appointment-list',
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.scss']
})
export class AppointmentListComponent implements OnInit {

  data = [{
    service: 'Full Shave',
    barber: 'Super Barber',
    date: new Date(),
    isDone: true,
    score: 3
  },
  {
    service: 'Full Shave',
    barber: 'The Barber',
    date: new Date('2020-10-1'),
    isDone: false,
    score: 3
  },
  {
    service: 'Full Shave',
    barber: 'The Barber',
    date: new Date(),
    isDone: false,
    score: 3
  }];

  columnsToDisplay = [ 'isDone', 'service', 'barber', 'date', 'actions' ];

  expandedElement = null;
  formGroup: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      rateControl: ['', Validators.required]
    });
  }

}
