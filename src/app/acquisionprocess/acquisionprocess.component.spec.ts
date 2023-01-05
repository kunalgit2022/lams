import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcquisionprocessComponent } from './acquisionprocess.component';

describe('AcquisionprocessComponent', () => {
  let component: AcquisionprocessComponent;
  let fixture: ComponentFixture<AcquisionprocessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcquisionprocessComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcquisionprocessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
