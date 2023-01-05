import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LahistoryComponent } from './lahistory.component';

describe('LahistoryComponent', () => {
  let component: LahistoryComponent;
  let fixture: ComponentFixture<LahistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LahistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LahistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
