import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HairSalonDetailsComponent } from './hair-salon-details.component';

describe('HairSalonDetailsComponent', () => {
  let component: HairSalonDetailsComponent;
  let fixture: ComponentFixture<HairSalonDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HairSalonDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HairSalonDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
