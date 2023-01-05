import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaprocessComponent } from './laprocess.component';

describe('LaprocessComponent', () => {
  let component: LaprocessComponent;
  let fixture: ComponentFixture<LaprocessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LaprocessComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LaprocessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
