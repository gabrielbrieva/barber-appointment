import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarberHistoriesComponent } from './barber-histories.component';

describe('BarberHistoriesComponent', () => {
  let component: BarberHistoriesComponent;
  let fixture: ComponentFixture<BarberHistoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BarberHistoriesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BarberHistoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
