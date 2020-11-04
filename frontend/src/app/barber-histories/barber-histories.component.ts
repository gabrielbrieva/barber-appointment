import { Component, OnInit } from '@angular/core';
import { IBarberHistory } from './histories';
import { Histories } from './histories';

@Component({
  selector: 'app-barber-histories',
  templateUrl: './barber-histories.component.html',
  styleUrls: ['./barber-histories.component.scss']
})
export class BarberHistoriesComponent implements OnInit {

  histories: IBarberHistory[] = Histories;

  constructor() { }

  ngOnInit(): void {

  }

}
