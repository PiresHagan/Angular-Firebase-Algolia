import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutSuccessSearchEngineCampaignComponent } from './checkout-success-search-engine-campaign.component';

describe('CheckoutSuccessSearchEngineCampaignComponent', () => {
  let component: CheckoutSuccessSearchEngineCampaignComponent;
  let fixture: ComponentFixture<CheckoutSuccessSearchEngineCampaignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckoutSuccessSearchEngineCampaignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutSuccessSearchEngineCampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
