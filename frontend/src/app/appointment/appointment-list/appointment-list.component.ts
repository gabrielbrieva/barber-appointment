import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { AuthService } from '@auth0/auth0-angular';
import { map } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api/api.service';
import { IAppointmentItem } from 'src/app/models/IAppointmentItem';
import { NGXLogger } from 'ngx-logger';

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

  constructor(private logger: NGXLogger, private formBuilder: FormBuilder,
              private apiSrv: ApiService, private auth: AuthService, private dialog: MatDialog) {

    this.auth.idTokenClaims$.pipe(map(r => r.__raw)).subscribe(async idToken => {
      this.logger.info(`Getting User Appointments...`);
      this.items = await this.apiSrv.getAppointmentsByUser(idToken);
      this.logger.debug(`User Appointments: ${JSON.stringify(this.items)}`);
    });
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      rateControl: ['', Validators.required]
    });
  }

  async delete(item: IAppointmentItem): Promise<void> {

    const dialogRef = this.dialog.open(DeleteDialogComponent);

    const subs = dialogRef.componentInstance.accept.subscribe(() => {
      subs.unsubscribe();
      this.auth.idTokenClaims$.pipe(map(r => r.__raw)).subscribe(async idToken => {
        try {

          this.logger.info(`Deleting Appointment ${item.appointmentId}`);

          await this.apiSrv.delete(item.appointmentId, idToken);

          const index = this.items.findIndex(i => i.appointmentId === item.appointmentId);

          if (index < 0) {
            this.items = await this.apiSrv.getAppointmentsByUser(idToken);
          } else {
            this.items.splice(index, 1);
          }

          this.logger.info(`Updating Appointment list after deletion`);
          this.table.renderRows();

        } catch (err) {
          this.logger.error(err);
        }

        dialogRef.close();
      });
    });
  }

}

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html'
})
export class DeleteDialogComponent {

  accept = new EventEmitter<void>();
  inProgres = false;

  delete(): void {
    this.inProgres = true;
    this.accept.emit();
  }

}
