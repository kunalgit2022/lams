import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeasecaseComponent } from './leasecase.component';

describe('LeasecaseComponent', () => {
  let component: LeasecaseComponent;
  let fixture: ComponentFixture<LeasecaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeasecaseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeasecaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
