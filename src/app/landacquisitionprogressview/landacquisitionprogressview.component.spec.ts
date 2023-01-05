import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandacquisitionprogressviewComponent } from './landacquisitionprogressview.component';

describe('LandacquisitionprogressviewComponent', () => {
  let component: LandacquisitionprogressviewComponent;
  let fixture: ComponentFixture<LandacquisitionprogressviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LandacquisitionprogressviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LandacquisitionprogressviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
