import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutSuccessTopContributorCampaignComponent } from './checkout-success-top-contributor-campaign.component';

describe('CheckoutSuccessTopContributorCampaignComponent', () => {
  let component: CheckoutSuccessTopContributorCampaignComponent;
  let fixture: ComponentFixture<CheckoutSuccessTopContributorCampaignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckoutSuccessTopContributorCampaignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutSuccessTopContributorCampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
