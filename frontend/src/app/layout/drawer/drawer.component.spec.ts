import { ComponentFixture, TestBed } from '@angular/core/testing';
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
      providers: [
        { provide: SidenavService, useValue: { toggle: () => {}, toggleChanged: of({}) } },
        { provide: AuthService, useValue: AuthServiceMock }
      ],
      declarations: [ DrawerComponent ]
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
