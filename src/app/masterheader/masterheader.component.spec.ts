import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterheaderComponent } from './masterheader.component';

describe('MasterheaderComponent', () => {
  let component: MasterheaderComponent;
  let fixture: ComponentFixture<MasterheaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterheaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasterheaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
