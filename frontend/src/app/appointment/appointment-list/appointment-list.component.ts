import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { AuthService } from '@auth0/auth0-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api/api.service';
import { IAppointmentItem } from 'src/app/services/api/models/IAppointmentItem';

@Component({
  selector: 'app-appointment-list',
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.scss']
})
export class AppointmentListComponent implements OnInit {

  @ViewChild('table')
  table: MatTable<IAppointmentItem>;

  items: IAppointmentItem[] = [];

  columnsToDisplay = [ 'isDone', 'service', 'barber', 'date', 'actions' ];

  expandedElement: IAppointmentItem = null;
  formGroup: FormGroup;

  constructor(private formBuilder: FormBuilder, private apiSrv: ApiService, private auth: AuthService) {
    this.auth.idTokenClaims$.pipe(map(r => r.__raw)).subscribe(async idToken => {
      this.items = await this.apiSrv.getAppointmentsByUser(idToken);
    });
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      rateControl: ['', Validators.required]
    });
  }

  async delete(item: IAppointmentItem): Promise<void> {
    this.auth.idTokenClaims$.pipe(map(r => r.__raw)).subscribe(async idToken => {
      try {
        await this.apiSrv.delete(item.appointmentId, idToken);

        const index = this.items.findIndex(i => i.appointmentId === item.appointmentId);

        if (index < 0) {
          this.items = await this.apiSrv.getAppointmentsByUser(idToken);
        } else {
          this.items.splice(index, 1);
        }

        this.table.renderRows();

      } catch (err) {
        console.log(err);
      }
    });
  }

}
