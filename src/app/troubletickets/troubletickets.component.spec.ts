import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TroubleticketsComponent } from './troubletickets.component';

describe('TroubleticketsComponent', () => {
  let component: TroubleticketsComponent;
  let fixture: ComponentFixture<TroubleticketsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TroubleticketsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TroubleticketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
