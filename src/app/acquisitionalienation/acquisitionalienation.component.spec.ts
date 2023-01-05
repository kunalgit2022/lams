import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcquisitionalienationComponent } from './acquisitionalienation.component';

describe('AcquisitionalienationComponent', () => {
  let component: AcquisitionalienationComponent;
  let fixture: ComponentFixture<AcquisitionalienationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcquisitionalienationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcquisitionalienationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
