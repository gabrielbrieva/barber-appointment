import { EventEmitter } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSidenav } from '@angular/material/sidenav';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService } from '@auth0/auth0-angular';
import { of } from 'rxjs';
import { SidenavService } from 'src/app/services/sidenav/sidenav.service';

import { DrawerComponent } from './drawer.component';

const AuthServiceMock = {
  isAuthenticated$: of<boolean>(true),
  user$: of<any>({ name: 'John Snow'})
};

describe('DrawerComponent', () => {
  let component: DrawerComponent;
  let fixture: ComponentFixture<DrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ BrowserAnimationsModule ],
      providers: [
        { provide: SidenavService, useValue: { toggle: () => {}, toggleChanged: new EventEmitter<void>() } },
        { provide: AuthService, useValue: AuthServiceMock }
      ],
      declarations: [ DrawerComponent, MatSidenav ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
