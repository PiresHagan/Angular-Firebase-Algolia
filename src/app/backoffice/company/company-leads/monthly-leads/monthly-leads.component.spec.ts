import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyLeadsComponent } from './monthly-leads.component';

describe('MonthlyLeadsComponent', () => {
  let component: MonthlyLeadsComponent;
  let fixture: ComponentFixture<MonthlyLeadsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonthlyLeadsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlyLeadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
