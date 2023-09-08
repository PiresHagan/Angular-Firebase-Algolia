import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HairSalonHomeComponent } from './hair-salon-home.component';

describe('HairSalonHomeComponent', () => {
  let component: HairSalonHomeComponent;
  let fixture: ComponentFixture<HairSalonHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HairSalonHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HairSalonHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
