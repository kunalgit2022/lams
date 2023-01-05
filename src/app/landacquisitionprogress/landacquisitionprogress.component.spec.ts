import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandacquisitionprogressComponent } from './landacquisitionprogress.component';

describe('LandacquisitionprogressComponent', () => {
  let component: LandacquisitionprogressComponent;
  let fixture: ComponentFixture<LandacquisitionprogressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LandacquisitionprogressComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LandacquisitionprogressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
