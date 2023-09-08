import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HairSalonListComponent } from './hair-salon-list.component';

describe('HairSalonListComponent', () => {
  let component: HairSalonListComponent;
  let fixture: ComponentFixture<HairSalonListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HairSalonListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HairSalonListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
