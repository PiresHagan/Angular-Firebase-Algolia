import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanySubscriptionComponent } from './company-subscription.component';

describe('CompanySubscriptionComponent', () => {
  let component: CompanySubscriptionComponent;
  let fixture: ComponentFixture<CompanySubscriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanySubscriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanySubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
