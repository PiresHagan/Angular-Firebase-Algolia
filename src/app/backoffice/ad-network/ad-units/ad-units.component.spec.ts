import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdUnitsComponent } from './ad-units.component';

describe('AdUnitsComponent', () => {
  let component: AdUnitsComponent;
  let fixture: ComponentFixture<AdUnitsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdUnitsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdUnitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
