import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidenavService } from 'src/app/services/sidenav/sidenav.service';

import { MenubarComponent } from './menubar.component';

describe('MenubarComponent', () => {
  let component: MenubarComponent;
  let fixture: ComponentFixture<MenubarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        {provide: SidenavService, useValue: jasmine.createSpyObj('SidenavService', [ 'toggle' ])}
      ],
      declarations: [ MenubarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenubarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
