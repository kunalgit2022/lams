import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterfooterComponent } from './masterfooter.component';

describe('MasterfooterComponent', () => {
  let component: MasterfooterComponent;
  let fixture: ComponentFixture<MasterfooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterfooterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasterfooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
