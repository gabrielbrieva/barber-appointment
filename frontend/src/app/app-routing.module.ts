import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BarberHistoriesComponent } from './barber-histories/barber-histories.component';

const routes: Routes = [
  { path: '', component: BarberHistoriesComponent }//,
  //{ path: 'appointment/:id', component: AppointmentDetailComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
