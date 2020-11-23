import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IBarberHistory } from '../models/IBarberHistory';
import { ApiService } from '../services/api/api.service';

@Component({
  selector: 'app-barber-histories',
  templateUrl: './barber-histories.component.html',
  styleUrls: ['./barber-histories.component.scss']
})
export class BarberHistoriesComponent {

  histories$: Observable<IBarberHistory[]>;

  constructor(private apiSrv: ApiService, public auth: AuthService) {
    this.histories$ = apiSrv.getAppointments().pipe(
        map(items => {
          return items.map(i => {
            return {
              barberName: i.barberId,
              date: new Date(`${i.date} ${i.time}`),
              serviceName: i.serviceId,
              userName: i.userName,
              beforeImg: i.beforeImg,
              afterImg: i.afterImg,
              comment: i.comment,
              score: i.score
            };
          });
        })
      );
  }

}
