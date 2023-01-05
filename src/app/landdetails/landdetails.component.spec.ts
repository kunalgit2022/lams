import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LanddetailsComponent } from './landdetails.component';

describe('LanddetailsComponent', () => {
  let component: LanddetailsComponent;
  let fixture: ComponentFixture<LanddetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LanddetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LanddetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
