import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessFundingComponent } from './business-funding.component';

describe('BusinessFundingComponent', () => {
  let component: BusinessFundingComponent;
  let fixture: ComponentFixture<BusinessFundingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessFundingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessFundingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
