import { TestBed } from '@angular/core/testing';
import { NGXLogger } from 'ngx-logger';

import { SidenavService } from './sidenav.service';

describe('SidenavService', () => {
  let service: SidenavService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: NGXLogger, useValue: jasmine.createSpyObj('NGXLogger', [ 'debug', 'info', 'error' ]) }
      ]
    });
    service = TestBed.inject(SidenavService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
