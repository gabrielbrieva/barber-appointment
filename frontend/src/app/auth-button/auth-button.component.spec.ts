import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '@auth0/auth0-angular';
import { LogoutOptions } from '@auth0/auth0-spa-js';
import { of } from 'rxjs';

import { AuthButtonComponent } from './auth-button.component';

const AuthServiceMock = {
  isAuthenticated$: of<boolean>(true),
  user$: of<any>({ name: 'John Snow', picture: 'path/to/user/picture'}),
  logout: (options: LogoutOptions) => {},
  loginWithRedirect: () => {}
};

describe('AuthButtonComponent', () => {
  let component: AuthButtonComponent;
  let fixture: ComponentFixture<AuthButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ MatMenuModule ],
      providers: [
        { provide: AuthService, useValue: AuthServiceMock }
      ],
      declarations: [ AuthButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
