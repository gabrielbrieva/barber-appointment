import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppointmentItemComponent } from './appointment/appointment-item/appointment-item.component';
import { AppointmentListComponent } from './appointment/appointment-list/appointment-list.component';
import { BarberHistoriesComponent } from './barber-histories/barber-histories.component';

const routes: Routes = [
  { path: '', component: BarberHistoriesComponent },
  { path: 'appointments', component: AppointmentListComponent },
  { path: 'appointment/:id', component: AppointmentItemComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
