import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';

import { MenubarComponent } from './layout/menubar/menubar.component';
import { LayoutComponent } from './layout/layout.component';
import { DrawerComponent } from './layout/drawer/drawer.component';
import { BarberHistoriesComponent } from './barber-histories/barber-histories.component';
import { ImageFallbackDirective } from './directives/image-fallback.directive';
import { RatingComponent } from './rating/rating.component';
import { AuthButtonComponent } from './auth/auth-button/auth-button.component';
import { UserProfileComponent } from './auth/user-profile/user-profile.component';
import { AuthModule } from '@auth0/auth0-angular';
import { AppointmentItemComponent } from './appointment/appointment-item/appointment-item.component';
import { AppointmentListComponent } from './appointment/appointment-list/appointment-list.component';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    MenubarComponent,
    LayoutComponent,
    DrawerComponent,
    BarberHistoriesComponent,
    ImageFallbackDirective,
    RatingComponent,
    AuthButtonComponent,
    UserProfileComponent,
    AppointmentItemComponent,
    AppointmentListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AuthModule.forRoot({
      domain: environment.auth0Domain,
      clientId: environment.auth0ClientId
    }),
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatCardModule,
    MatMenuModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
