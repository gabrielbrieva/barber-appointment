import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NGXLogger } from 'ngx-logger';

import { RatingComponent } from './rating.component';

describe('RatingComponent', () => {
  let component: RatingComponent;
  let fixture: ComponentFixture<RatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        {provide: NGXLogger, useValue: jasmine.createSpyObj('NGXLogger', [ 'debug', 'info', 'error' ])}
      ],
      declarations: [ RatingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
