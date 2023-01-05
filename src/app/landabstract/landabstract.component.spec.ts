import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandabstractComponent } from './landabstract.component';

describe('LandabstractComponent', () => {
  let component: LandabstractComponent;
  let fixture: ComponentFixture<LandabstractComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LandabstractComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LandabstractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
