import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAdUnitsComponent } from './manage-ad-units.component';

describe('ManageAdUnitsComponent', () => {
  let component: ManageAdUnitsComponent;
  let fixture: ComponentFixture<ManageAdUnitsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageAdUnitsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageAdUnitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
