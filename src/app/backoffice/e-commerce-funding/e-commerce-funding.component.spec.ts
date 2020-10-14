import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ECommerceFundingComponent } from './e-commerce-funding.component';

describe('ECommerceFundingComponent', () => {
  let component: ECommerceFundingComponent;
  let fixture: ComponentFixture<ECommerceFundingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ECommerceFundingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ECommerceFundingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
