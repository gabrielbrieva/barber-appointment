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
import { MatStepperModule } from '@angular/material/stepper';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { MenubarComponent } from './layout/menubar/menubar.component';
import { LayoutComponent } from './layout/layout.component';
import { DrawerComponent } from './layout/drawer/drawer.component';
import { BarberHistoriesComponent } from './barber-histories/barber-histories.component';
import { ImageFallbackDirective } from './directives/image-fallback.directive';
import { RatingComponent } from './rating/rating.component';
import { AuthModule } from '@auth0/auth0-angular';
import { AppointmentItemComponent, CropDialogComponent } from './appointment/appointment-item/appointment-item.component';
import { AppointmentListComponent, DeleteDialogComponent } from './appointment/appointment-list/appointment-list.component';
import { environment } from 'src/environments/environment';
import { AppointmentWizardComponent } from './appointment/appointment-wizard/appointment-wizard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthButtonComponent } from './auth-button/auth-button.component';
import { DatePipe } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ImageCropperModule } from 'ngx-image-cropper';

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
    AppointmentItemComponent,
    AppointmentListComponent,
    AppointmentWizardComponent,
    DeleteDialogComponent,
    CropDialogComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AuthModule.forRoot({
      domain: environment.auth0Domain,
      clientId: environment.auth0ClientId
    }),
    FormsModule,
    ReactiveFormsModule,
    ImageCropperModule,
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
    MatMenuModule,
    MatStepperModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatDialogModule,
    MatTooltipModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
