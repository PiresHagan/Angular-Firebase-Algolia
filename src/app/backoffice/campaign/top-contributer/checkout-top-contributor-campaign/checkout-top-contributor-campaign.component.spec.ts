import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutTopContributorCampaignComponent } from './checkout-top-contributor-campaign.component';

describe('CheckoutTopContributorCampaignComponent', () => {
  let component: CheckoutTopContributorCampaignComponent;
  let fixture: ComponentFixture<CheckoutTopContributorCampaignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckoutTopContributorCampaignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutTopContributorCampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
